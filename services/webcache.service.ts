/**
 * Web Cache Service
 *
 * Provides a simple in-memory cache for web view URLs with configurable TTL.
 * This helps improve performance when navigating back to previously viewed pages.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@app/webcache/';
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  url: string;
  title: string;
  timestamp: number;
  ttl: number;
}

interface CacheMetadata {
  lastVisited: number;
  visitCount: number;
}

/**
 * Check if a cache entry is still valid
 */
function isCacheValid(entry: CacheEntry): boolean {
  const now = Date.now();
  return now - entry.timestamp < entry.ttl;
}

/**
 * Generate a cache key from URL
 */
function getCacheKey(url: string): string {
  // Create a simple hash from URL for the key
  const hash = url.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  return `${CACHE_PREFIX}${Math.abs(hash)}`;
}

/**
 * Get cached metadata for a URL
 */
export async function getCacheMetadata(url: string): Promise<CacheMetadata | null> {
  try {
    const key = getCacheKey(url);
    const data = await AsyncStorage.getItem(key);
    if (!data) return null;

    const entry: CacheEntry = JSON.parse(data);
    if (!isCacheValid(entry)) {
      // Cache expired, remove it
      await AsyncStorage.removeItem(key);
      return null;
    }

    return {
      lastVisited: entry.timestamp,
      visitCount: 1, // Simple implementation - could track this separately
    };
  } catch (error) {
    console.warn('Error reading web cache:', error);
    return null;
  }
}

/**
 * Check if URL is cached and still valid
 */
export async function isUrlCached(url: string, ttlMs: number = DEFAULT_TTL_MS): Promise<boolean> {
  try {
    const key = getCacheKey(url);
    const data = await AsyncStorage.getItem(key);
    if (!data) return false;

    const entry: CacheEntry = JSON.parse(data);
    return isCacheValid({ ...entry, ttl: ttlMs });
  } catch (error) {
    console.warn('Error checking web cache:', error);
    return false;
  }
}

/**
 * Cache a URL visit
 */
export async function cacheUrlVisit(
  url: string,
  title: string,
  ttlMs: number = DEFAULT_TTL_MS
): Promise<void> {
  try {
    const key = getCacheKey(url);
    const entry: CacheEntry = {
      url,
      title,
      timestamp: Date.now(),
      ttl: ttlMs,
    };
    await AsyncStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    console.warn('Error caching URL visit:', error);
  }
}

/**
 * Get time remaining for cache in milliseconds
 */
export async function getCacheTimeRemaining(url: string): Promise<number> {
  try {
    const key = getCacheKey(url);
    const data = await AsyncStorage.getItem(key);
    if (!data) return 0;

    const entry: CacheEntry = JSON.parse(data);
    const elapsed = Date.now() - entry.timestamp;
    const remaining = entry.ttl - elapsed;
    return Math.max(0, remaining);
  } catch (error) {
    console.warn('Error getting cache time remaining:', error);
    return 0;
  }
}

/**
 * Clear cache for a specific URL
 */
export async function clearUrlCache(url: string): Promise<void> {
  try {
    const key = getCacheKey(url);
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn('Error clearing URL cache:', error);
  }
}

/**
 * Clear all web view caches
 */
export async function clearAllWebCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(cacheKeys);
  } catch (error) {
    console.warn('Error clearing all web caches:', error);
  }
}

/**
 * Format cache time remaining for display
 */
export function formatCacheTimeRemaining(ms: number): string {
  if (ms <= 0) return 'Expired';
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
}
