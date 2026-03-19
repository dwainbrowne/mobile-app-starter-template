/**
 * API Configuration Constants
 * 
 * Centralized configuration for all API-related settings.
 * All endpoints, base URLs, and API keys should be defined here.
 * Supports production and development environments.
 */

// Environment detection
const isDevelopment = __DEV__ ?? process.env.NODE_ENV === 'development';

/**
 * Environment configuration type
 */
interface EnvironmentConfig {
  baseUrl: string;
  apiVersion: string;
  timeout: number;
}

/**
 * API Keys configuration type
 */
interface ApiKeysConfig {
  functionKey: string;
  managementKey: string;
}

/**
 * Environment-specific configurations
 */
const ENVIRONMENTS: Record<'development' | 'production', EnvironmentConfig> = {
  development: {
    baseUrl: 'https://api-dev.example.com',
    apiVersion: 'v1',
    timeout: 30000, // 30 seconds
  },
  production: {
    baseUrl: 'https://api.example.com',
    apiVersion: 'v1',
    timeout: 15000, // 15 seconds
  },
};

/**
 * Current environment configuration
 */
export const ENV_CONFIG: EnvironmentConfig = isDevelopment 
  ? ENVIRONMENTS.development 
  : ENVIRONMENTS.production;

/**
 * API Keys - Should be loaded from environment variables in production
 * These are placeholder values - replace with actual keys or env vars
 */
export const API_KEYS: ApiKeysConfig = {
  functionKey: process.env.EXPO_PUBLIC_API_FUNCTION_KEY ?? '',
  managementKey: process.env.EXPO_PUBLIC_API_MANAGEMENT_KEY ?? '',
};

/**
 * Full base URL with API version
 */
export const API_BASE_URL = `${ENV_CONFIG.baseUrl}/api/${ENV_CONFIG.apiVersion}`;

/**
 * API Endpoints - All endpoints are defined here
 * Group by domain/feature for better organization
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_OTP: '/auth/verify-otp',
    SEND_OTP: '/auth/send-otp',
  },

  // User management
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    PREFERENCES: '/users/preferences',
    BY_ID: (id: string) => `/users/${id}`,
  },

  // Transactions
  TRANSACTIONS: {
    BASE: '/transactions',
    BY_ID: (id: string) => `/transactions/${id}`,
    SEARCH: '/transactions/search',
    SUMMARY: '/transactions/summary',
    CATEGORIES: '/transactions/categories',
  },

  // Receipts
  RECEIPTS: {
    BASE: '/receipts',
    BY_ID: (id: string) => `/receipts/${id}`,
    UPLOAD: '/receipts/upload',
    SCAN: '/receipts/scan',
    PROCESS: '/receipts/process',
  },

  // Recurring
  RECURRING: {
    BASE: '/recurring',
    BY_ID: (id: string) => `/recurring/${id}`,
    UPCOMING: '/recurring/upcoming',
    HISTORY: '/recurring/history',
  },

  // Documents
  DOCUMENTS: {
    BASE: '/documents',
    BY_ID: (id: string) => `/documents/${id}`,
    UPLOAD: '/documents/upload',
    DOWNLOAD: (id: string) => `/documents/${id}/download`,
  },

  // Activity / Notifications
  ACTIVITY: {
    BASE: '/activity',
    NOTIFICATIONS: '/activity/notifications',
    MARK_READ: (id: string) => `/activity/notifications/${id}/read`,
    MARK_ALL_READ: '/activity/notifications/read-all',
  },

  // Settings
  SETTINGS: {
    BASE: '/settings',
    APP: '/settings/app',
    NOTIFICATIONS: '/settings/notifications',
    PRIVACY: '/settings/privacy',
  },

  // Analytics / Reports
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    REPORTS: '/analytics/reports',
    EXPORT: '/analytics/export',
  },
} as const;

/**
 * HTTP Status codes for reference
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Cache configuration
 */
export const CACHE_CONFIG = {
  // Storage key prefix for the app
  STORAGE_KEY_PREFIX: '@app_cache',
  
  // Default cache expiration times (in milliseconds)
  EXPIRY: {
    SHORT: 5 * 60 * 1000,        // 5 minutes
    MEDIUM: 30 * 60 * 1000,      // 30 minutes
    LONG: 60 * 60 * 1000,        // 1 hour
    VERY_LONG: 24 * 60 * 60 * 1000, // 24 hours
    INFINITE: Infinity,          // Never expires
  },
} as const;

/**
 * Cache keys for tenant-scoped storage
 * All cache keys should be defined here for consistency
 */
export const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  USER_PREFERENCES: 'user_preferences',
  TRANSACTIONS: 'transactions',
  RECEIPTS: 'receipts',
  RECURRING: 'recurring',
  DOCUMENTS: 'documents',
  ACTIVITY: 'activity',
  SETTINGS: 'settings',
  ANALYTICS_DASHBOARD: 'analytics_dashboard',
} as const;

/**
 * Request headers configuration
 */
export const REQUEST_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept',
  API_FUNCTION_KEY: 'x-functions-key',
  API_MANAGEMENT_KEY: 'x-api-key',
} as const;

/**
 * Content types
 */
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
} as const;

/**
 * Helper to check if current environment is development
 */
export const isDevEnvironment = (): boolean => isDevelopment;

/**
 * Helper to get the full endpoint URL
 */
export const getFullUrl = (endpoint: string): string => `${API_BASE_URL}${endpoint}`;
