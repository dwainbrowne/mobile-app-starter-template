/**
 * API Service
 * 
 * Generic API service for handling all HTTP requests.
 * Provides centralized CRUD operations with authentication,
 * caching, error handling, and request/response interceptors.
 */

import {
    API_BASE_URL,
    API_KEYS,
    CACHE_CONFIG,
    CONTENT_TYPES,
    ENV_CONFIG,
    HTTP_STATUS,
    REQUEST_HEADERS,
} from '@/constants/api';
import type {
    ApiError,
    ApiRequestConfig,
    ApiResponse,
    ApiServiceConfig,
    PaginatedResponse,
    PaginationParams,
    RequestInterceptor,
    RequestOptions,
    ResponseInterceptor,
    UploadOptions
} from '@/interfaces/api';
import { cacheService } from './cache.service';

/**
 * Token getter function type - to be set by auth context
 */
type TokenGetter = () => Promise<string | null>;

/**
 * API Service class for handling all HTTP requests
 */
class ApiService {
  private baseUrl: string;
  private timeout: number;
  private tokenGetter: TokenGetter | null = null;
  private onUnauthorized: (() => void) | null = null;
  private onError: ((error: ApiError) => void) | null = null;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor(config?: Partial<ApiServiceConfig>) {
    this.baseUrl = config?.baseUrl ?? API_BASE_URL;
    this.timeout = config?.timeout ?? ENV_CONFIG.timeout;
    this.onUnauthorized = config?.onUnauthorized ?? null;
    this.onError = config?.onError ?? null;
  }

  /**
   * Set the token getter function (called from AuthContext)
   */
  setTokenGetter(getter: TokenGetter): void {
    this.tokenGetter = getter;
  }

  /**
   * Set the unauthorized handler
   */
  setOnUnauthorized(handler: () => void): void {
    this.onUnauthorized = handler;
  }

  /**
   * Set the error handler
   */
  setOnError(handler: (error: ApiError) => void): void {
    this.onError = handler;
  }

  /**
   * Add a request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add a response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Build headers for the request
   */
  private async buildHeaders(
    withAuth: boolean = true,
    additionalHeaders?: Record<string, string>
  ): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      [REQUEST_HEADERS.ACCEPT]: CONTENT_TYPES.JSON,
      ...additionalHeaders,
    };

    // Add API keys if configured
    if (API_KEYS.functionKey) {
      headers[REQUEST_HEADERS.API_FUNCTION_KEY] = API_KEYS.functionKey;
    }
    if (API_KEYS.managementKey) {
      headers[REQUEST_HEADERS.API_MANAGEMENT_KEY] = API_KEYS.managementKey;
    }

    // Add auth token if required
    if (withAuth && this.tokenGetter) {
      const token = await this.tokenGetter();
      if (token) {
        headers[REQUEST_HEADERS.AUTHORIZATION] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Create a timeout promise
   */
  private createTimeout(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Request timeout after ${ms}ms`));
      }, ms);
    });
  }

  /**
   * Parse error from response or exception
   */
  private parseError(error: unknown, status?: number): ApiError {
    if (error instanceof Error) {
      return {
        message: error.message,
        status,
        code: 'REQUEST_ERROR',
      };
    }
    
    if (typeof error === 'object' && error !== null) {
      const err = error as Record<string, unknown>;
      return {
        message: (err.message as string) || 'Unknown error',
        code: (err.code as string) || 'UNKNOWN_ERROR',
        status,
        details: err,
      };
    }
    
    return {
      message: String(error),
      code: 'UNKNOWN_ERROR',
      status,
    };
  }

  /**
   * Generate cache key from endpoint and options
   */
  private generateCacheKey(endpoint: string, options?: RequestOptions): string {
    const method = options?.method ?? 'GET';
    const body = options?.body ? JSON.stringify(options.body) : '';
    return `${method}:${endpoint}:${body}`;
  }

  /**
   * Core request method
   */
  async request<T>(
    endpoint: string,
    options: RequestOptions,
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      withAuth = true,
      timeout = this.timeout,
      headers: configHeaders,
      useCache = false,
      expiry = CACHE_CONFIG.EXPIRY.MEDIUM,
      cacheKey,
      forceRefresh = false,
    } = config;

    // Generate cache key
    const finalCacheKey = cacheKey ?? this.generateCacheKey(endpoint, options);

    // Check cache for GET requests
    if (useCache && options.method === 'GET' && !forceRefresh) {
      const cached = await cacheService.get<T>(finalCacheKey);
      if (cached !== null) {
        return {
          data: cached,
          error: null,
          status: HTTP_STATUS.OK,
          success: true,
        };
      }
    }

    try {
      // Build headers
      const headers = await this.buildHeaders(withAuth, {
        ...configHeaders,
        ...options.headers,
      });

      // Prepare request options
      let finalEndpoint = endpoint;
      let finalOptions: RequestOptions = {
        ...options,
        headers,
      };

      // Run request interceptors
      for (const interceptor of this.requestInterceptors) {
        const result = await interceptor(finalEndpoint, finalOptions);
        finalEndpoint = result.endpoint;
        finalOptions = result.options;
      }

      // Make the request with timeout
      const url = finalEndpoint.startsWith('http') 
        ? finalEndpoint 
        : `${this.baseUrl}${finalEndpoint}`;

      const response = await Promise.race([
        fetch(url, finalOptions as RequestInit),
        this.createTimeout(timeout),
      ]);

      // Handle unauthorized
      if (response.status === HTTP_STATUS.UNAUTHORIZED) {
        if (this.onUnauthorized) {
          this.onUnauthorized();
        }
        return {
          data: null,
          error: {
            message: 'Unauthorized',
            code: 'UNAUTHORIZED',
            status: HTTP_STATUS.UNAUTHORIZED,
          },
          status: HTTP_STATUS.UNAUTHORIZED,
          success: false,
        };
      }

      // Parse response
      let data: T | null = null;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        const json = await response.json();
        // Handle common API response structures
        data = json.data ?? json.resources ?? json.result ?? json;
      } else if (response.status !== HTTP_STATUS.NO_CONTENT) {
        // For non-JSON responses, try to get text
        const text = await response.text();
        data = text as unknown as T;
      }

      // Build response
      let apiResponse: ApiResponse<T> = {
        data,
        error: response.ok ? null : {
          message: `HTTP error ${response.status}`,
          status: response.status,
          code: 'HTTP_ERROR',
        },
        status: response.status,
        success: response.ok,
      };

      // Run response interceptors
      for (const interceptor of this.responseInterceptors) {
        apiResponse = await interceptor(apiResponse) as ApiResponse<T>;
      }

      // Cache successful GET responses
      if (useCache && options.method === 'GET' && apiResponse.success && data !== null) {
        await cacheService.set(finalCacheKey, data, expiry);
      }

      // Handle error callback
      if (!apiResponse.success && apiResponse.error && this.onError) {
        this.onError(apiResponse.error);
      }

      return apiResponse;
    } catch (error) {
      const apiError = this.parseError(error);
      
      if (this.onError) {
        this.onError(apiError);
      }

      return {
        data: null,
        error: apiError,
        status: 0,
        success: false,
      };
    }
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      { method: 'GET' },
      config
    );
  }

  /**
   * GET request with cache
   */
  async getCached<T>(
    endpoint: string,
    expiry: number = CACHE_CONFIG.EXPIRY.MEDIUM,
    config?: Omit<ApiRequestConfig, 'useCache' | 'expiry'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      { method: 'GET' },
      { ...config, useCache: true, expiry }
    );
  }

  /**
   * POST request
   */
  async post<T, D = unknown>(
    endpoint: string,
    data?: D,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        headers: { [REQUEST_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON },
        body: data ? JSON.stringify(data) : null,
      },
      config
    );
  }

  /**
   * PUT request
   */
  async put<T, D = unknown>(
    endpoint: string,
    data: D,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: 'PUT',
        headers: { [REQUEST_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON },
        body: JSON.stringify(data),
      },
      config
    );
  }

  /**
   * PATCH request
   */
  async patch<T, D = unknown>(
    endpoint: string,
    data: D,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: 'PATCH',
        headers: { [REQUEST_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON },
        body: JSON.stringify(data),
      },
      config
    );
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      { method: 'DELETE' },
      config
    );
  }

  /**
   * Upload file(s)
   */
  async upload<T>(
    endpoint: string,
    formData: FormData,
    options?: UploadOptions,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    // Note: Don't set Content-Type header for FormData
    // The browser will set it automatically with the boundary
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: formData,
      },
      config
    );
  }

  /**
   * List with pagination
   */
  async list<T>(
    endpoint: string,
    params?: PaginationParams,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.set('page', String(params.page));
    if (params?.pageSize) queryParams.set('pageSize', String(params.pageSize));
    if (params?.sortBy) queryParams.set('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.set('sortOrder', params.sortOrder);
    
    const queryString = queryParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.get<PaginatedResponse<T>>(url, config);
  }

  /**
   * Invalidate cache for an endpoint
   */
  async invalidateCache(endpoint: string): Promise<void> {
    await cacheService.invalidatePattern(endpoint);
  }

  /**
   * Clear all cache
   */
  async clearAllCache(): Promise<void> {
    await cacheService.clearCache();
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export class for custom instances
export { ApiService };

export default apiService;
