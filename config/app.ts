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
  primary: '#6366F1', // Indigo/Purple-Blue - main brand color
  primaryLight: '#818CF8', // Lighter indigo
  secondary: '#3B82F6', // Blue - secondary actions
  accent: '#F97316', // Orange - highlights & CTAs
  danger: '#EF4444', // Red - destructive actions
  success: '#10B981', // Emerald - success states
  warning: '#F59E0B', // Amber - warnings
  background: '#0F172A', // Dark slate background
  surface: '#1E293B', // Card/surface background
  text: '#F1F5F9', // Primary text (light)
  textSecondary: '#94A3B8', // Secondary text
  border: '#334155', // Border color
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
