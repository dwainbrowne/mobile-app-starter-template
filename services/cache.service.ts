/**
 * Cache Service
 * 
 * An AsyncStorage-based caching service for React Native.
 * This implementation maintains an in-memory cache and persists to AsyncStorage.
 * Supports tenant-scoped keys and configurable expiration.
 */

import { CACHE_CONFIG } from '@/constants/api';
import type { CacheEntry } from '@/interfaces/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

class CacheService {
  private readonly storageKeyPrefix: string;
  private inMemoryCache: Record<string, CacheEntry<unknown>> = {};
  private isInitialized: boolean = false;
  private initPromise: Promise<void> | null = null;

  constructor(storageKeyPrefix: string = CACHE_CONFIG.STORAGE_KEY_PREFIX) {
    this.storageKeyPrefix = storageKeyPrefix;
    // Auto-initialize on construction
    this.initPromise = this.initialize();
  }

  /**
   * Initialize the cache by loading from AsyncStorage
   */
  private async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      const stored = await AsyncStorage.getItem(this.getStorageKey());
      if (stored) {
        const parsed = JSON.parse(stored);
        // Filter out expired entries on load
        this.inMemoryCache = this.filterExpired(parsed);
      }
      this.isInitialized = true;
    } catch (error) {
      console.warn('[CacheService] Error initializing cache:', error);
      this.inMemoryCache = {};
      this.isInitialized = true;
    }
  }

  /**
   * Ensure cache is initialized before operations
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized && this.initPromise) {
      await this.initPromise;
    }
  }

  /**
   * Get the full storage key with prefix
   */
  private getStorageKey(): string {
    return `${this.storageKeyPrefix}_cache`;
  }

  /**
   * Generate a tenant-scoped cache key
   */
  getTenantScopedKey(key: string, tenantId?: string): string {
    const tenant = tenantId ?? 'default';
    return `${key}_${tenant}`;
  }

  /**
   * Filter out expired entries from cache
   */
  private filterExpired(cache: Record<string, CacheEntry<unknown>>): Record<string, CacheEntry<unknown>> {
    const now = Date.now();
    const filtered: Record<string, CacheEntry<unknown>> = {};
    
    for (const [key, entry] of Object.entries(cache)) {
      if (entry.expiry === Infinity || now - entry.timestamp < entry.expiry) {
        filtered[key] = entry;
      }
    }
    
    return filtered;
  }

  /**
   * Load cache from AsyncStorage
   */
  async loadCache(): Promise<Record<string, CacheEntry<unknown>>> {
    await this.ensureInitialized();
    return this.inMemoryCache;
  }

  /**
   * Save cache to AsyncStorage
   */
  async saveCache(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.getStorageKey(),
        JSON.stringify(this.inMemoryCache)
      );
    } catch (error) {
      console.warn('[CacheService] Error saving cache:', error);
    }
  }

  /**
   * Clear all cached data
   */
  async clearCache(): Promise<void> {
    this.inMemoryCache = {};
    try {
      await AsyncStorage.removeItem(this.getStorageKey());
    } catch (error) {
      console.warn('[CacheService] Error clearing cache:', error);
    }
  }

  /**
   * Clear a specific cache key
   */
  async clearKey(key: string): Promise<void> {
    await this.ensureInitialized();
    
    if (this.inMemoryCache[key]) {
      delete this.inMemoryCache[key];
      await this.saveCache();
    }
  }

  /**
   * Clear multiple cache keys
   */
  async clearKeys(keys: string[]): Promise<void> {
    await this.ensureInitialized();
    
    let hasChanges = false;
    for (const key of keys) {
      if (this.inMemoryCache[key]) {
        delete this.inMemoryCache[key];
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      await this.saveCache();
    }
  }

  /**
   * Check if a cache entry exists and is valid
   */
  async has(key: string): Promise<boolean> {
    await this.ensureInitialized();
    
    const entry = this.inMemoryCache[key];
    if (!entry) return false;
    
    const isExpired = entry.expiry !== Infinity && 
      Date.now() - entry.timestamp >= entry.expiry;
    
    if (isExpired) {
      delete this.inMemoryCache[key];
      return false;
    }
    
    return true;
  }

  /**
   * Get a cached value
   */
  async get<T>(key: string): Promise<T | null> {
    await this.ensureInitialized();
    
    const entry = this.inMemoryCache[key] as CacheEntry<T> | undefined;
    if (!entry) return null;
    
    const isExpired = entry.expiry !== Infinity && 
      Date.now() - entry.timestamp >= entry.expiry;
    
    if (isExpired) {
      delete this.inMemoryCache[key];
      await this.saveCache();
      return null;
    }
    
    return entry.data;
  }

  /**
   * Set a cached value
   */
  async set<T>(key: string, data: T, expiry: number = CACHE_CONFIG.EXPIRY.MEDIUM): Promise<void> {
    await this.ensureInitialized();
    
    this.inMemoryCache[key] = {
      data,
      timestamp: Date.now(),
      expiry,
    };
    
    await this.saveCache();
  }

  /**
   * Fetch with cache
   * 
   * Checks for a cached value using a unique key.
   * If found and not expired, returns it. Otherwise, calls the API,
   * stores the result with a timestamp, and returns the new data.
   */
  async fetchWithCache<T>(
    key: string,
    apiCall: () => Promise<T>,
    expiry: number = CACHE_CONFIG.EXPIRY.MEDIUM,
    forceRefresh: boolean = false
  ): Promise<T> {
    await this.ensureInitialized();
    
    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }
    }
    
    // Call API and cache result
    const data = await apiCall();
    await this.set(key, data, expiry);
    
    return data;
  }

  /**
   * Invalidate cache entries matching a pattern
   */
  async invalidatePattern(pattern: string | RegExp): Promise<void> {
    await this.ensureInitialized();
    
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    const keysToDelete: string[] = [];
    
    for (const key of Object.keys(this.inMemoryCache)) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }
    
    await this.clearKeys(keysToDelete);
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    totalEntries: number;
    validEntries: number;
    expiredEntries: number;
    memorySize: number;
  }> {
    await this.ensureInitialized();
    
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;
    
    for (const entry of Object.values(this.inMemoryCache)) {
      const isExpired = entry.expiry !== Infinity && 
        now - entry.timestamp >= entry.expiry;
      
      if (isExpired) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }
    
    return {
      totalEntries: Object.keys(this.inMemoryCache).length,
      validEntries,
      expiredEntries,
      memorySize: JSON.stringify(this.inMemoryCache).length,
    };
  }
}

// Export singleton instance
export const cacheService = new CacheService();

// Export class for custom instances
export { CacheService };

export default cacheService;
