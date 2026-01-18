/**
 * Settings Service
 *
 * Utility functions for settings management and iframe communication.
 */

import type { AppSettings, IframeQueryParams } from '@/interfaces/settings';
import type { ThemeStyle } from '@/interfaces/theme';
import { appendQueryToUrl, buildQueryString } from './querystring.service';

/**
 * Build query params from current app settings for iframe communication
 */
export function buildSettingsQueryParams(settings: AppSettings): IframeQueryParams {
  return {
    theme: settings.preferences.theme.style,
    darkMode: settings.preferences.theme.mode === 'dark',
    currency: settings.preferences.currency,
    language: settings.preferences.language,
    dateFormat: settings.preferences.dateFormat,
  };
}

/**
 * Create iframe URL with all relevant settings
 */
export function createSettingsIframeUrl(baseUrl: string, settings: AppSettings): string {
  const params = buildSettingsQueryParams(settings);
  return appendQueryToUrl(baseUrl, params);
}

/**
 * Get just the theme-related query params
 */
export function getThemeParams(style: ThemeStyle, isDark: boolean): string {
  return buildQueryString({
    theme: style,
    darkMode: isDark,
  });
}

/**
 * Validate settings object structure
 */
export function validateSettings(settings: unknown): settings is AppSettings {
  if (!settings || typeof settings !== 'object') {
    return false;
  }

  const s = settings as Record<string, unknown>;
  return (
    typeof s.profile === 'object' &&
    typeof s.team === 'object' &&
    Array.isArray(s.categories) &&
    typeof s.notifications === 'object' &&
    typeof s.preferences === 'object'
  );
}

/**
 * Merge partial settings with defaults
 */
export function mergeWithDefaults(
  partial: Partial<AppSettings>,
  defaults: AppSettings
): AppSettings {
  return {
    profile: { ...defaults.profile, ...partial.profile },
    team: { ...defaults.team, ...partial.team },
    categories: partial.categories || defaults.categories,
    notifications: { ...defaults.notifications, ...partial.notifications },
    preferences: { ...defaults.preferences, ...partial.preferences },
    lastUpdated: new Date().toISOString(),
  };
}
