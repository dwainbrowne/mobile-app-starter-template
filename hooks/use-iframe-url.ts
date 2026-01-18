/**
 * useIframeUrl Hook
 *
 * Hook to generate iframe URLs with current theme and settings
 * automatically appended as query parameters.
 */

import { useMemo } from 'react';

import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { appendQueryToUrl, buildQueryString, mergeQueryParams } from '@/services/querystring.service';

interface UseIframeUrlOptions {
  /** Additional custom parameters to include */
  customParams?: Record<string, string | number | boolean>;
  /** Include user settings like currency and language */
  includeLocale?: boolean;
  /** Include theme parameters */
  includeTheme?: boolean;
}

/**
 * Hook to generate iframe URLs with settings
 */
export function useIframeUrl(baseUrl: string, options: UseIframeUrlOptions = {}) {
  const { style, isDark } = useTheme();
  const { settings } = useSettings();

  const {
    customParams = {},
    includeLocale = true,
    includeTheme = true,
  } = options;

  const url = useMemo(() => {
    const params: Record<string, string | number | boolean | undefined> = {};

    // Add theme params
    if (includeTheme) {
      params.theme = style;
      params.darkMode = isDark;
    }

    // Add locale params
    if (includeLocale) {
      params.currency = settings.preferences.currency;
      params.language = settings.preferences.language;
      params.dateFormat = settings.preferences.dateFormat;
    }

    // Merge with custom params
    const allParams = mergeQueryParams(params, customParams);

    return appendQueryToUrl(baseUrl, allParams);
  }, [baseUrl, style, isDark, settings.preferences, customParams, includeLocale, includeTheme]);

  return url;
}

/**
 * Hook to get just the theme query string
 */
export function useThemeQueryString() {
  const { style, isDark } = useTheme();

  return useMemo(() => {
    return buildQueryString({
      theme: style,
      darkMode: isDark,
    });
  }, [style, isDark]);
}

/**
 * Hook to get all settings as query params
 */
export function useSettingsQueryString() {
  const { style, isDark } = useTheme();
  const { settings } = useSettings();

  return useMemo(() => {
    return buildQueryString({
      theme: style,
      darkMode: isDark,
      currency: settings.preferences.currency,
      language: settings.preferences.language,
      dateFormat: settings.preferences.dateFormat,
    });
  }, [style, isDark, settings.preferences]);
}
