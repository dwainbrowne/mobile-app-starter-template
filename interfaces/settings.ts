/**
 * Settings Interfaces
 *
 * Type definitions for the centralized settings system
 * supporting user preferences, categories, and iframe communication.
 */

import type { ThemeConfig, ThemeStyle } from './theme';

/**
 * User profile settings
 */
export interface UserProfileSettings {
  displayName: string;
  email?: string;
  avatarUrl?: string;
}

/**
 * Team member information
 */
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  avatarUrl?: string;
  invitedAt?: string;
  joinedAt?: string;
}

/**
 * Team settings
 */
export interface TeamSettings {
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  maxMembers: number;
  members: TeamMember[];
}

/**
 * Category for transactions/budgets
 */
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income' | 'both';
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
}

/**
 * Notification preferences
 */
export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  budgetAlerts: boolean;
  transactionAlerts: boolean;
  weeklyReport: boolean;
  monthlyReport: boolean;
}

/**
 * App preferences
 */
export interface AppPreferences {
  theme: ThemeConfig;
  hapticFeedback: boolean;
  soundEffects: boolean;
  currency: string;
  language: string;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  startOfWeek: 'sunday' | 'monday';
}

/**
 * Complete app settings
 */
export interface AppSettings {
  profile: UserProfileSettings;
  team: TeamSettings;
  categories: Category[];
  notifications: NotificationSettings;
  preferences: AppPreferences;
  lastUpdated: string;
}

/**
 * Settings context value
 */
export interface SettingsContextValue {
  // State
  settings: AppSettings;
  isLoading: boolean;

  // Profile actions
  updateProfile: (profile: Partial<UserProfileSettings>) => void;

  // Team actions
  updateTeam: (team: Partial<TeamSettings>) => void;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  removeTeamMember: (memberId: string) => void;
  updateTeamMember: (memberId: string, updates: Partial<TeamMember>) => void;

  // Category actions
  addCategory: (category: Omit<Category, 'id'>) => void;
  removeCategory: (categoryId: string) => void;
  updateCategory: (categoryId: string, updates: Partial<Category>) => void;
  reorderCategories: (categoryIds: string[]) => void;

  // Notification actions
  updateNotifications: (notifications: Partial<NotificationSettings>) => void;

  // Preference actions
  updatePreferences: (preferences: Partial<AppPreferences>) => void;

  // Theme shortcuts
  setThemeMode: (mode: 'light' | 'dark') => void;
  setThemeStyle: (style: ThemeStyle) => void;

  // Utilities
  resetToDefaults: () => void;
  exportSettings: () => string;
  importSettings: (json: string) => boolean;
}

/**
 * Query parameters that can be passed to iframe
 */
export interface IframeQueryParams {
  // Theme
  theme?: ThemeStyle;
  darkMode?: boolean;

  // User context
  userId?: string;
  teamId?: string;

  // Feature flags
  features?: string[];

  // Locale
  currency?: string;
  language?: string;
  dateFormat?: string;

  // Custom params
  [key: string]: string | number | boolean | string[] | undefined;
}
