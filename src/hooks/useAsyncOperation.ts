import { useState, useCallback, useRef, useEffect } from 'react';
import { ApiErrorHandler, withRetry, RetryConfig } from '@/utils/errorHandling';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: any;
  success: boolean;
}

export interface UseAsyncOperationOptions {
  showToast?: boolean;
  toastTitle?: string;
  retryConfig?: Partial<RetryConfig>;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useAsyncOperation<T = any>(
  options: UseAsyncOperationOptions = {}
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const execute = useCallback(async (
    operation: (signal?: AbortSignal) => Promise<T>
  ): Promise<{ data?: T; error?: any; success: boolean }> => {
    // Cancel previous operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      success: false,
    }));

    try {
      const wrappedOperation = () => operation(signal);
      
      const data = options.retryConfig
        ? await withRetry(wrappedOperation, options.retryConfig)
        : await wrappedOperation();

      // Check if operation was aborted
      if (signal.aborted) {
        return { success: false };
      }

      setState({
        data,
        loading: false,
        error: null,
        success: true,
      });

      // Call success callback
      if (options.onSuccess) {
        options.onSuccess(data);
      }

      return { data, success: true };
    } catch (error: any) {
      // Check if operation was aborted
      if (signal.aborted) {
        return { success: false };
      }

      setState({
        data: null,
        loading: false,
        error,
        success: false,
      });

      // Handle error
      ApiErrorHandler.handle(error, {
        showToast: options.showToast,
        toastTitle: options.toastTitle,
      });

      // Call error callback
      if (options.onError) {
        options.onError(error);
      }

      return { error, success: false };
    }
  }, [options]);

  const reset = useCallback(() => {
    // Cancel ongoing operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  const retry = useCallback(async (
    operation: (signal?: AbortSignal) => Promise<T>
  ) => {
    return execute(operation);
  }, [execute]);

  return {
    ...state,
    execute,
    reset,
    retry,
    isLoading: state.loading,
    hasError: !!state.error,
    hasData: !!state.data,
  };
}

// Hook for managing multiple async operations
export function useAsyncOperations() {
  const [operations, setOperations] = useState<Record<string, AsyncState<any>>>({});

  const execute = useCallback(async (
    key: string,
    operation: () => Promise<any>,
    options: UseAsyncOperationOptions = {}
  ): Promise<{ data?: any; error?: any; success: boolean }> => {
    // Set loading state
    setOperations(prev => ({
      ...prev,
      [key]: {
        data: null,
        loading: true,
        error: null,
        success: false,
      },
    }));

    try {
      const data = options.retryConfig
        ? await withRetry(operation, options.retryConfig)
        : await operation();

      setOperations(prev => ({
        ...prev,
        [key]: {
          data,
          loading: false,
          error: null,
          success: true,
        },
      }));

      if (options.onSuccess) {
        options.onSuccess(data);
      }

      return { data, success: true };
    } catch (error: any) {
      setOperations(prev => ({
        ...prev,
        [key]: {
          data: null,
          loading: false,
          error,
          success: false,
        },
      }));

      ApiErrorHandler.handle(error, {
        showToast: options.showToast,
        toastTitle: options.toastTitle,
      });

      if (options.onError) {
        options.onError(error);
      }

      return { error, success: false };
    }
  }, []);

  const reset = useCallback((key?: string) => {
    if (key) {
      setOperations(prev => {
        const newOps = { ...prev };
        delete newOps[key];
        return newOps;
      });
    } else {
      setOperations({});
    }
  }, []);

  const getOperation = useCallback((key: string) => {
    return operations[key] || {
      data: null,
      loading: false,
      error: null,
      success: false,
    };
  }, [operations]);

  const isAnyLoading = Object.values(operations).some(op => op.loading);
  const hasAnyError = Object.values(operations).some(op => op.error);

  return {
    operations,
    execute,
    reset,
    getOperation,
    isAnyLoading,
    hasAnyError,
  };
}

// Hook for data fetching with caching
export function useAsyncData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: UseAsyncOperationOptions & {
    enabled?: boolean;
    refetchOnMount?: boolean;
    cacheTime?: number;
  } = {}
) {
  const {
    enabled = true,
    refetchOnMount = true,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    ...asyncOptions
  } = options;

  const asyncOp = useAsyncOperation<T>(asyncOptions);
  const lastFetchRef = useRef<number>(0);
  const cacheRef = useRef<T | null>(null);

  const shouldFetch = useCallback(() => {
    if (!enabled) return false;
    if (!refetchOnMount && cacheRef.current) return false;
    
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchRef.current;
    
    return timeSinceLastFetch > cacheTime || !cacheRef.current;
  }, [enabled, refetchOnMount, cacheTime]);

  const fetch = useCallback(async () => {
    if (!shouldFetch()) {
      return { data: cacheRef.current, success: true };
    }

    const result = await asyncOp.execute(fetcher);
    
    if (result.success && result.data) {
      cacheRef.current = result.data;
      lastFetchRef.current = Date.now();
    }

    return result;
  }, [asyncOp, fetcher, shouldFetch]);

  const refetch = useCallback(async () => {
    lastFetchRef.current = 0; // Force refetch
    return fetch();
  }, [fetch]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (enabled && shouldFetch()) {
      fetch();
    }
  }, [enabled, fetch, shouldFetch]);

  return {
    ...asyncOp,
    fetch,
    refetch,
    data: asyncOp.data || cacheRef.current,
  };
}

export default useAsyncOperation;
