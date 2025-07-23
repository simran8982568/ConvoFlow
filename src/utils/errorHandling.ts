import { toast } from '@/hooks/use-toast';

// Error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
  timestamp?: string;
}

export interface NetworkError extends Error {
  isNetworkError: true;
  status?: number;
}

export interface ValidationError extends Error {
  isValidationError: true;
  fields?: Record<string, string[]>;
}

// Error classification
export const ErrorTypes = {
  NETWORK: 'NETWORK',
  VALIDATION: 'VALIDATION',
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  NOT_FOUND: 'NOT_FOUND',
  SERVER: 'SERVER',
  UNKNOWN: 'UNKNOWN',
} as const;

export type ErrorType = typeof ErrorTypes[keyof typeof ErrorTypes];

// Error classifier
export function classifyError(error: any): ErrorType {
  if (!error) return ErrorTypes.UNKNOWN;

  // Network errors
  if (error.name === 'NetworkError' || error.isNetworkError) {
    return ErrorTypes.NETWORK;
  }

  // HTTP status-based classification
  if (error.status || error.response?.status) {
    const status = error.status || error.response?.status;
    
    if (status === 401) return ErrorTypes.AUTHENTICATION;
    if (status === 403) return ErrorTypes.AUTHORIZATION;
    if (status === 404) return ErrorTypes.NOT_FOUND;
    if (status === 422 || error.isValidationError) return ErrorTypes.VALIDATION;
    if (status >= 500) return ErrorTypes.SERVER;
  }

  // Validation errors
  if (error.isValidationError || error.fields) {
    return ErrorTypes.VALIDATION;
  }

  return ErrorTypes.UNKNOWN;
}

// User-friendly error messages
export function getErrorMessage(error: any): string {
  const errorType = classifyError(error);
  
  // Use custom message if available
  if (error.message && typeof error.message === 'string') {
    return error.message;
  }

  // Default messages by type
  switch (errorType) {
    case ErrorTypes.NETWORK:
      return 'Network connection failed. Please check your internet connection and try again.';
    case ErrorTypes.AUTHENTICATION:
      return 'Authentication failed. Please log in again.';
    case ErrorTypes.AUTHORIZATION:
      return 'You don\'t have permission to perform this action.';
    case ErrorTypes.NOT_FOUND:
      return 'The requested resource was not found.';
    case ErrorTypes.VALIDATION:
      return 'Please check your input and try again.';
    case ErrorTypes.SERVER:
      return 'Server error occurred. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

// Retry configuration
export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryCondition?: (error: any) => boolean;
}

export const defaultRetryConfig: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  retryCondition: (error) => {
    const errorType = classifyError(error);
    return errorType === ErrorTypes.NETWORK || errorType === ErrorTypes.SERVER;
  },
};

// Retry utility with exponential backoff
export async function withRetry<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const finalConfig = { ...defaultRetryConfig, ...config };
  let lastError: any;
  
  for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry if condition is not met
      if (finalConfig.retryCondition && !finalConfig.retryCondition(error)) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === finalConfig.maxAttempts) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        finalConfig.baseDelay * Math.pow(finalConfig.backoffFactor, attempt - 1),
        finalConfig.maxDelay
      );
      
      console.warn(`Operation failed (attempt ${attempt}/${finalConfig.maxAttempts}). Retrying in ${delay}ms...`, error);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

// API error handler
export class ApiErrorHandler {
  static handle(error: any, options: {
    showToast?: boolean;
    toastTitle?: string;
    logError?: boolean;
    throwError?: boolean;
  } = {}) {
    const {
      showToast = true,
      toastTitle = 'Error',
      logError = true,
      throwError = false,
    } = options;

    const errorMessage = getErrorMessage(error);
    const errorType = classifyError(error);

    // Log error
    if (logError) {
      console.error(`[${errorType}] API Error:`, {
        message: errorMessage,
        originalError: error,
        timestamp: new Date().toISOString(),
      });
    }

    // Show toast notification
    if (showToast) {
      toast({
        title: toastTitle,
        description: errorMessage,
        variant: 'destructive',
      });
    }

    // Re-throw if requested
    if (throwError) {
      throw error;
    }

    return {
      error,
      message: errorMessage,
      type: errorType,
    };
  }

  static async handleAsync<T>(
    operation: () => Promise<T>,
    options: {
      showToast?: boolean;
      toastTitle?: string;
      logError?: boolean;
      retryConfig?: Partial<RetryConfig>;
    } = {}
  ): Promise<{ data?: T; error?: any; success: boolean }> {
    try {
      const data = options.retryConfig
        ? await withRetry(operation, options.retryConfig)
        : await operation();
      
      return { data, success: true };
    } catch (error) {
      this.handle(error, options);
      return { error, success: false };
    }
  }
}

// Global error handler for unhandled promise rejections
export function setupGlobalErrorHandling() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Prevent the default browser behavior
    event.preventDefault();
    
    // Handle the error
    ApiErrorHandler.handle(event.reason, {
      toastTitle: 'Unexpected Error',
      showToast: true,
    });
  });

  // Handle global errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    // Handle the error
    ApiErrorHandler.handle(event.error, {
      toastTitle: 'Application Error',
      showToast: true,
    });
  });
}

// Error boundary helper
export function createErrorBoundaryHandler(componentName: string) {
  return (error: Error, errorInfo: any) => {
    console.error(`Error in ${componentName}:`, error, errorInfo);
    
    // Log to error reporting service in production
    if (import.meta.env.PROD) {
      // Example: Send to error reporting service
      // errorReportingService.captureException(error, {
      //   tags: { component: componentName },
      //   extra: errorInfo,
      // });
    }
  };
}

export default ApiErrorHandler;
