/**
 * APP CONFIG
 *
 * Core app settings: identity, colors, features, and default user.
 * Navigation configs are in separate files for clarity.
 *
 * NOTE: For authentication configuration (auth type, branding, version info),
 * see auth.config.ts which is the single source of truth for all auth-related settings.
 */

import type { AppColors, AppFeatures, AppIdentity, UserInfo } from '@/interfaces';
import { brandingConfig, versionInfo } from './auth.config';

// ===========================================
// APP IDENTITY (sourced from auth.config.ts)
// ===========================================
export const appIdentity: AppIdentity = {
  appName: brandingConfig.appName,
  appTagline: brandingConfig.tagline,
  version: versionInfo.version,
  buildNumber: versionInfo.buildNumber,
  buildDate: versionInfo.buildDate,
};

// ===========================================
// BRANDING COLORS
// ===========================================
export const appColors: AppColors = {
  primary: '#7B42F6', // SnapSuite Purple - main brand color
  primaryLight: '#9B6BFA', // Lighter purple
  secondary: '#4A7CF7', // Blue - gradient end color
  accent: '#10B981', // Green - action buttons (Quick Clock In, Accept)
  danger: '#EF4444', // Red - destructive actions
  success: '#10B981', // Emerald - success states
  warning: '#F59E0B', // Amber - warnings
  background: '#FFFFFF', // White background (light mode default)
  surface: '#F3F4F6', // Gray-100 surface background
  text: '#1F2937', // Dark text
  textSecondary: '#6B7280', // Secondary text
  border: '#E5E7EB', // Border color
};

// ===========================================
// FEATURE FLAGS
// ===========================================
export const appFeatures: AppFeatures = {
  showUserAvatar: true,
  showNotificationBell: true,
  showQuickActionButton: true, // Show the floating "+" button
  hapticFeedback: true,
};

// ===========================================
// DEFAULT USER (Guest Mode)
// ===========================================
export const defaultUser: UserInfo = {
  name: 'Guest User',
  subtitle: 'Welcome to the App',
};
