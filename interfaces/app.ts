/**
 * App Interfaces
 *
 * Shared interfaces for app configuration.
 */

export interface UserInfo {
  name: string;
  subtitle?: string;
  avatarUrl?: string;
}

export interface AppColors {
  primary: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  danger: string;
  success: string;
  warning: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  textMuted?: string;
  border: string;
}

export interface AppFeatures {
  showUserAvatar: boolean;
  showNotificationBell: boolean;
  showQuickActionButton: boolean;
  hapticFeedback: boolean;
}

export interface AppIdentity {
  appName: string;
  appTagline?: string;
  version: string;
  buildNumber?: string;
  buildDate?: string;
}
