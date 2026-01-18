/**
 * Query String Service
 *
 * Centralized service for building query strings to pass settings
 * to iframes or other external applications.
 */

import type { IframeQueryParams } from '@/interfaces/settings';
import type { ThemeStyle } from '@/interfaces/theme';

/**
 * Options for building query strings
 */
export interface QueryStringOptions {
  /** Whether to include undefined values as empty strings */
  includeEmpty?: boolean;
  /** Custom encoder for values */
  encoder?: (value: string) => string;
  /** Prefix to add to all keys (e.g., 'app_') */
  keyPrefix?: string;
  /** Separator for array values (default: ',') */
  arraySeparator?: string;
}

/**
 * Build a query string from an object of parameters
 */
export function buildQueryString(
  params: Record<string, string | number | boolean | string[] | undefined>,
  options: QueryStringOptions = {}
): string {
  const {
    includeEmpty = false,
    encoder = encodeURIComponent,
    keyPrefix = '',
    arraySeparator = ',',
  } = options;

  const pairs: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    // Skip undefined/null unless includeEmpty is true
    if (value === undefined || value === null) {
      if (includeEmpty) {
        pairs.push(`${keyPrefix}${encoder(key)}=`);
      }
      continue;
    }

    // Handle different value types
    if (Array.isArray(value)) {
      if (value.length > 0) {
        pairs.push(`${keyPrefix}${encoder(key)}=${encoder(value.join(arraySeparator))}`);
      }
    } else if (typeof value === 'boolean') {
      pairs.push(`${keyPrefix}${encoder(key)}=${value ? '1' : '0'}`);
    } else {
      pairs.push(`${keyPrefix}${encoder(key)}=${encoder(String(value))}`);
    }
  }

  return pairs.join('&');
}

/**
 * Parse a query string back into an object
 */
export function parseQueryString(
  queryString: string,
  options: { arraySeparator?: string } = {}
): Record<string, string | string[]> {
  const { arraySeparator = ',' } = options;

  if (!queryString || queryString.length === 0) {
    return {};
  }

  // Remove leading '?' if present
  const cleanQuery = queryString.startsWith('?') ? queryString.slice(1) : queryString;

  const result: Record<string, string | string[]> = {};

  for (const pair of cleanQuery.split('&')) {
    const [key, value] = pair.split('=').map(decodeURIComponent);
    if (key) {
      // Check if value contains separator (array)
      if (value && value.includes(arraySeparator)) {
        result[key] = value.split(arraySeparator);
      } else {
        result[key] = value || '';
      }
    }
  }

  return result;
}

/**
 * Append query string to a URL
 */
export function appendQueryToUrl(baseUrl: string, params: Record<string, string | number | boolean | string[] | undefined>): string {
  const queryString = buildQueryString(params);
  if (!queryString) {
    return baseUrl;
  }

  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}${queryString}`;
}

/**
 * Build iframe query params from app settings
 */
export function buildIframeParams(options: {
  theme?: ThemeStyle;
  darkMode?: boolean;
  userId?: string;
  teamId?: string;
  currency?: string;
  language?: string;
  dateFormat?: string;
  features?: string[];
  customParams?: Record<string, string | number | boolean>;
}): IframeQueryParams {
  return {
    theme: options.theme,
    darkMode: options.darkMode,
    userId: options.userId,
    teamId: options.teamId,
    currency: options.currency,
    language: options.language,
    dateFormat: options.dateFormat,
    features: options.features,
    ...options.customParams,
  };
}

/**
 * Create a complete iframe URL with settings
 */
export function createIframeUrl(
  baseUrl: string,
  settings: {
    theme: ThemeStyle;
    darkMode: boolean;
    currency?: string;
    language?: string;
    userId?: string;
  }
): string {
  const params = buildIframeParams({
    theme: settings.theme,
    darkMode: settings.darkMode,
    currency: settings.currency,
    language: settings.language,
    userId: settings.userId,
  });

  return appendQueryToUrl(baseUrl, params);
}

/**
 * Hook-friendly function to get current theme params
 */
export function getThemeQueryParams(style: ThemeStyle, isDark: boolean): string {
  return buildQueryString({
    theme: style,
    darkMode: isDark,
  });
}

/**
 * Merge multiple query parameter objects
 */
export function mergeQueryParams(
  ...paramSets: Record<string, string | number | boolean | string[] | undefined>[]
): Record<string, string | number | boolean | string[] | undefined> {
  return Object.assign({}, ...paramSets);
}
