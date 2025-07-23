import { ApiErrorHandler, withRetry, RetryConfig } from './errorHandling';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const DEFAULT_TIMEOUT = 30000; // 30 seconds

// Request interceptor type
type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
type ResponseInterceptor = (response: any) => any | Promise<any>;
type ErrorInterceptor = (error: any) => any | Promise<any>;

interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
  retryConfig?: Partial<RetryConfig>;
  signal?: AbortSignal;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

class ApiService {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Add interceptors
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  addErrorInterceptor(interceptor: ErrorInterceptor) {
    this.errorInterceptors.push(interceptor);
  }

  // Set default headers
  setDefaultHeader(key: string, value: string) {
    this.defaultHeaders[key] = value;
  }

  // Remove default header
  removeDefaultHeader(key: string) {
    delete this.defaultHeaders[key];
  }

  // Set auth token
  setAuthToken(token: string) {
    this.setDefaultHeader('Authorization', `Bearer ${token}`);
  }

  // Remove auth token
  removeAuthToken() {
    this.removeDefaultHeader('Authorization');
  }

  // Build URL with params
  private buildURL(url: string, params?: Record<string, any>): string {
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    
    if (!params) return fullURL;

    const urlObj = new URL(fullURL);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlObj.searchParams.append(key, String(value));
      }
    });

    return urlObj.toString();
  }

  // Apply request interceptors
  private async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let finalConfig = { ...config };
    
    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor(finalConfig);
    }
    
    return finalConfig;
  }

  // Apply response interceptors
  private async applyResponseInterceptors(response: any): Promise<any> {
    let finalResponse = response;
    
    for (const interceptor of this.responseInterceptors) {
      finalResponse = await interceptor(finalResponse);
    }
    
    return finalResponse;
  }

  // Apply error interceptors
  private async applyErrorInterceptors(error: any): Promise<any> {
    let finalError = error;
    
    for (const interceptor of this.errorInterceptors) {
      finalError = await interceptor(finalError);
    }
    
    return finalError;
  }

  // Core request method
  private async makeRequest<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    try {
      // Apply request interceptors
      const finalConfig = await this.applyRequestInterceptors(config);

      // Build URL
      const url = this.buildURL(finalConfig.url, finalConfig.params);

      // Prepare headers
      const headers = {
        ...this.defaultHeaders,
        ...finalConfig.headers,
      };

      // Prepare fetch options
      const fetchOptions: RequestInit = {
        method: finalConfig.method || 'GET',
        headers,
        signal: finalConfig.signal,
      };

      // Add body for non-GET requests
      if (finalConfig.data && finalConfig.method !== 'GET') {
        fetchOptions.body = JSON.stringify(finalConfig.data);
      }

      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Request timeout after ${finalConfig.timeout || DEFAULT_TIMEOUT}ms`));
        }, finalConfig.timeout || DEFAULT_TIMEOUT);
      });

      // Make the request with timeout
      const response = await Promise.race([
        fetch(url, fetchOptions),
        timeoutPromise,
      ]);

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        (error as any).status = response.status;
        (error as any).response = errorData;
        throw error;
      }

      // Parse response
      const data = await response.json().catch(() => null);

      const apiResponse: ApiResponse<T> = {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      };

      // Apply response interceptors
      return await this.applyResponseInterceptors(apiResponse);

    } catch (error: any) {
      // Apply error interceptors
      const processedError = await this.applyErrorInterceptors(error);
      throw processedError;
    }
  }

  // Public HTTP methods
  async get<T = any>(url: string, config: Omit<RequestConfig, 'url' | 'method'> = {}): Promise<ApiResponse<T>> {
    const operation = () => this.makeRequest<T>({ ...config, url, method: 'GET' });
    
    return config.retryConfig 
      ? withRetry(operation, config.retryConfig)
      : operation();
  }

  async post<T = any>(url: string, data?: any, config: Omit<RequestConfig, 'url' | 'method' | 'data'> = {}): Promise<ApiResponse<T>> {
    const operation = () => this.makeRequest<T>({ ...config, url, method: 'POST', data });
    
    return config.retryConfig 
      ? withRetry(operation, config.retryConfig)
      : operation();
  }

  async put<T = any>(url: string, data?: any, config: Omit<RequestConfig, 'url' | 'method' | 'data'> = {}): Promise<ApiResponse<T>> {
    const operation = () => this.makeRequest<T>({ ...config, url, method: 'PUT', data });
    
    return config.retryConfig 
      ? withRetry(operation, config.retryConfig)
      : operation();
  }

  async patch<T = any>(url: string, data?: any, config: Omit<RequestConfig, 'url' | 'method' | 'data'> = {}): Promise<ApiResponse<T>> {
    const operation = () => this.makeRequest<T>({ ...config, url, method: 'PATCH', data });
    
    return config.retryConfig 
      ? withRetry(operation, config.retryConfig)
      : operation();
  }

  async delete<T = any>(url: string, config: Omit<RequestConfig, 'url' | 'method'> = {}): Promise<ApiResponse<T>> {
    const operation = () => this.makeRequest<T>({ ...config, url, method: 'DELETE' });
    
    return config.retryConfig 
      ? withRetry(operation, config.retryConfig)
      : operation();
  }

  // Convenience method for handling API calls with error handling
  async safeRequest<T = any>(
    requestFn: () => Promise<ApiResponse<T>>,
    options: {
      showToast?: boolean;
      toastTitle?: string;
      onSuccess?: (data: T) => void;
      onError?: (error: any) => void;
    } = {}
  ): Promise<{ data?: T; error?: any; success: boolean }> {
    return ApiErrorHandler.handleAsync(
      async () => {
        const response = await requestFn();
        return response.data;
      },
      options
    );
  }
}

// Create default instance
const apiService = new ApiService();

// Add default interceptors
apiService.addRequestInterceptor((config) => {
  // Add timestamp to prevent caching
  if (config.method === 'GET') {
    config.params = {
      ...config.params,
      _t: Date.now(),
    };
  }
  
  return config;
});

apiService.addErrorInterceptor((error) => {
  // Handle 401 errors globally
  if (error.status === 401) {
    // Redirect to login or refresh token
    console.warn('Unauthorized access detected');
    // You might want to dispatch a logout action here
  }
  
  return error;
});

export default apiService;
export { ApiService };
export type { RequestConfig, ApiResponse };
