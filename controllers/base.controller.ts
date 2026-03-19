/**
 * Base Controller
 * 
 * Abstract base class providing common CRUD operations for all controllers.
 * Extend this class to create domain-specific controllers.
 */

import { CACHE_CONFIG } from '@/constants/api';
import type {
    ApiRequestConfig,
    ApiResponse,
    CrudResult,
    PaginatedResponse,
    PaginationParams,
} from '@/interfaces/api';
import { apiService } from '@/services/api.service';
import { cacheService } from '@/services/cache.service';

/**
 * Controller configuration options
 */
export interface ControllerConfig {
  /** Base API endpoint for this domain */
  baseEndpoint: string;
  /** Cache key prefix for this domain */
  cacheKey: string;
  /** Default cache expiry time */
  defaultExpiry?: number;
  /** Whether to cache list operations by default */
  cacheList?: boolean;
  /** Whether to cache get operations by default */
  cacheGet?: boolean;
}

/**
 * Base controller class with common CRUD operations
 */
export abstract class BaseController<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>> {
  protected readonly api = apiService;
  protected readonly cache = cacheService;
  protected readonly config: Required<ControllerConfig>;

  constructor(config: ControllerConfig) {
    this.config = {
      defaultExpiry: CACHE_CONFIG.EXPIRY.MEDIUM,
      cacheList: true,
      cacheGet: true,
      ...config,
    };
  }

  /**
   * Generate a cache key for a specific resource
   */
  protected getCacheKey(suffix?: string): string {
    return suffix ? `${this.config.cacheKey}_${suffix}` : this.config.cacheKey;
  }

  /**
   * Get all items with pagination
   */
  async getAll(
    params?: PaginationParams,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    const cacheKey = this.getCacheKey(`list_${JSON.stringify(params ?? {})}`);
    
    return this.api.list<T>(
      this.config.baseEndpoint,
      params,
      {
        ...config,
        useCache: config?.useCache ?? this.config.cacheList,
        expiry: config?.expiry ?? this.config.defaultExpiry,
        cacheKey,
      }
    );
  }

  /**
   * Get a single item by ID
   */
  async getById(
    id: string,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const cacheKey = this.getCacheKey(`item_${id}`);
    
    return this.api.get<T>(
      `${this.config.baseEndpoint}/${id}`,
      {
        ...config,
        useCache: config?.useCache ?? this.config.cacheGet,
        expiry: config?.expiry ?? this.config.defaultExpiry,
        cacheKey,
      }
    );
  }

  /**
   * Create a new item
   */
  async create(
    data: CreateDTO,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.api.post<T, CreateDTO>(
      this.config.baseEndpoint,
      data,
      config
    );

    // Invalidate list cache on successful create
    if (response.success) {
      await this.invalidateListCache();
    }

    return response;
  }

  /**
   * Update an existing item
   */
  async update(
    id: string,
    data: UpdateDTO,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.api.put<T, UpdateDTO>(
      `${this.config.baseEndpoint}/${id}`,
      data,
      config
    );

    // Invalidate caches on successful update
    if (response.success) {
      await this.invalidateItemCache(id);
      await this.invalidateListCache();
    }

    return response;
  }

  /**
   * Partially update an existing item
   */
  async patch(
    id: string,
    data: Partial<UpdateDTO>,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.api.patch<T, Partial<UpdateDTO>>(
      `${this.config.baseEndpoint}/${id}`,
      data,
      config
    );

    // Invalidate caches on successful patch
    if (response.success) {
      await this.invalidateItemCache(id);
      await this.invalidateListCache();
    }

    return response;
  }

  /**
   * Delete an item
   */
  async delete(
    id: string,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<void>> {
    const response = await this.api.delete<void>(
      `${this.config.baseEndpoint}/${id}`,
      config
    );

    // Invalidate caches on successful delete
    if (response.success) {
      await this.invalidateItemCache(id);
      await this.invalidateListCache();
    }

    return response;
  }

  /**
   * Invalidate cache for a specific item
   */
  async invalidateItemCache(id: string): Promise<void> {
    await this.cache.clearKey(this.getCacheKey(`item_${id}`));
  }

  /**
   * Invalidate all list caches for this controller
   */
  async invalidateListCache(): Promise<void> {
    await this.cache.invalidatePattern(`${this.config.cacheKey}_list`);
  }

  /**
   * Invalidate all caches for this controller
   */
  async invalidateAllCache(): Promise<void> {
    await this.cache.invalidatePattern(this.config.cacheKey);
  }

  /**
   * Refresh data by forcing a cache miss
   */
  async refresh(id?: string): Promise<ApiResponse<T | PaginatedResponse<T>>> {
    if (id) {
      await this.invalidateItemCache(id);
      return this.getById(id) as Promise<ApiResponse<T | PaginatedResponse<T>>>;
    } else {
      await this.invalidateListCache();
      return this.getAll() as Promise<ApiResponse<T | PaginatedResponse<T>>>;
    }
  }

  /**
   * Helper to convert ApiResponse to CrudResult
   */
  protected toCrudResult<R>(response: ApiResponse<R>): CrudResult<R> {
    return {
      success: response.success,
      data: response.data ?? undefined,
      error: response.error?.message,
      message: response.success ? 'Operation successful' : response.error?.message,
    };
  }
}
