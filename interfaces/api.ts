/**
 * API Interfaces
 * 
 * TypeScript type definitions for API-related operations.
 */

/**
 * HTTP methods supported by the API service
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Request options for API calls
 */
export interface RequestOptions {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: BodyInit | null;
  timeout?: number;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: number;
  success: boolean;
}

/**
 * API error structure
 */
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Pagination parameters for list requests
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Search/filter parameters
 */
export interface SearchParams extends PaginationParams {
  query?: string;
  filters?: Record<string, unknown>;
  startDate?: string;
  endDate?: string;
}

/**
 * Cache entry structure
 */
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

/**
 * Cache options for API calls
 */
export interface CacheOptions {
  /** Whether to use cache for this request */
  useCache?: boolean;
  /** Cache expiration time in milliseconds */
  expiry?: number;
  /** Custom cache key (auto-generated if not provided) */
  cacheKey?: string;
  /** Force refresh even if cache exists */
  forceRefresh?: boolean;
}

/**
 * API service configuration
 */
export interface ApiServiceConfig {
  baseUrl: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
  onUnauthorized?: () => void;
  onError?: (error: ApiError) => void;
}

/**
 * Authentication tokens
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
}

/**
 * Request interceptor function type
 */
export type RequestInterceptor = (
  endpoint: string,
  options: RequestOptions
) => Promise<{ endpoint: string; options: RequestOptions }>;

/**
 * Response interceptor function type
 */
export type ResponseInterceptor<T = unknown> = (
  response: ApiResponse<T>
) => Promise<ApiResponse<T>>;

/**
 * Upload progress callback
 */
export type UploadProgressCallback = (progress: {
  loaded: number;
  total: number;
  percentage: number;
}) => void;

/**
 * File upload options
 */
export interface UploadOptions {
  onProgress?: UploadProgressCallback;
  fieldName?: string;
  additionalData?: Record<string, string>;
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxRetries?: number;
  retryDelay?: number;
  retryCondition?: (error: ApiError) => boolean;
}

/**
 * Full API request configuration
 */
export interface ApiRequestConfig extends CacheOptions, RetryConfig {
  withAuth?: boolean;
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * CRUD operation result
 */
export interface CrudResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Batch operation item
 */
export interface BatchOperationItem<T> {
  id: string;
  operation: 'create' | 'update' | 'delete';
  data?: T;
}

/**
 * Batch operation result
 */
export interface BatchOperationResult<T> {
  successful: Array<{ id: string; data?: T }>;
  failed: Array<{ id: string; error: string }>;
  totalProcessed: number;
}
