/**
 * Settings Context
 *
 * Centralized settings management for the app.
 * Handles user preferences, team settings, categories, and notifications.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import type {
    AppPreferences,
    AppSettings,
    Category,
    NotificationSettings,
    SettingsContextValue,
    TeamMember,
    TeamSettings,
    UserProfileSettings,
} from '@/interfaces/settings';
import type { ThemeStyle } from '@/interfaces/theme';

const SETTINGS_STORAGE_KEY = '@affordly/settings';

// ===========================================
// DEFAULT SETTINGS
// ===========================================

const defaultCategories: Category[] = [
  { id: '1', name: 'Food & Dining', icon: 'restaurant', color: '#F97316', type: 'expense', isDefault: true, isActive: true, sortOrder: 1 },
  { id: '2', name: 'Transportation', icon: 'car', color: '#3B82F6', type: 'expense', isDefault: true, isActive: true, sortOrder: 2 },
  { id: '3', name: 'Shopping', icon: 'cart', color: '#EC4899', type: 'expense', isDefault: true, isActive: true, sortOrder: 3 },
  { id: '4', name: 'Entertainment', icon: 'game-controller', color: '#8B5CF6', type: 'expense', isDefault: true, isActive: true, sortOrder: 4 },
  { id: '5', name: 'Bills & Utilities', icon: 'receipt', color: '#EF4444', type: 'expense', isDefault: true, isActive: true, sortOrder: 5 },
  { id: '6', name: 'Health', icon: 'fitness', color: '#10B981', type: 'expense', isDefault: true, isActive: true, sortOrder: 6 },
  { id: '7', name: 'Salary', icon: 'cash', color: '#22C55E', type: 'income', isDefault: true, isActive: true, sortOrder: 7 },
  { id: '8', name: 'Investment', icon: 'trending-up', color: '#6366F1', type: 'income', isDefault: true, isActive: true, sortOrder: 8 },
  { id: '9', name: 'Other', icon: 'ellipsis-horizontal', color: '#64748B', type: 'both', isDefault: true, isActive: true, sortOrder: 9 },
];

const defaultSettings: AppSettings = {
  profile: {
    displayName: 'Guest User',
    email: undefined,
    avatarUrl: undefined,
  },
  team: {
    name: "Guest's Workspace",
    plan: 'free',
    maxMembers: 2,
    members: [],
  },
  categories: defaultCategories,
  notifications: {
    pushEnabled: true,
    emailEnabled: true,
    budgetAlerts: true,
    transactionAlerts: true,
    weeklyReport: false,
    monthlyReport: true,
  },
  preferences: {
    theme: {
      mode: 'dark',
      style: 'grey',
    },
    hapticFeedback: true,
    soundEffects: false,
    currency: 'USD',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    startOfWeek: 'sunday',
  },
  lastUpdated: new Date().toISOString(),
};

// ===========================================
// CONTEXT
// ===========================================

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setSettings((prev) => ({
            ...prev,
            ...parsed,
            // Ensure nested objects are merged properly
            profile: { ...prev.profile, ...parsed.profile },
            team: { ...prev.team, ...parsed.team },
            notifications: { ...prev.notifications, ...parsed.notifications },
            preferences: { ...prev.preferences, ...parsed.preferences },
          }));
        }
      } catch (error) {
        console.warn('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  // Save settings when they change
  useEffect(() => {
    if (isLoading) return;

    const saveSettings = async () => {
      try {
        const toSave = {
          ...settings,
          lastUpdated: new Date().toISOString(),
        };
        await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(toSave));
      } catch (error) {
        console.warn('Failed to save settings:', error);
      }
    };
    saveSettings();
  }, [settings, isLoading]);

  // Profile actions
  const updateProfile = useCallback((profile: Partial<UserProfileSettings>) => {
    setSettings((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profile },
    }));
  }, []);

  // Team actions
  const updateTeam = useCallback((team: Partial<TeamSettings>) => {
    setSettings((prev) => ({
      ...prev,
      team: { ...prev.team, ...team },
    }));
  }, []);

  const addTeamMember = useCallback((member: Omit<TeamMember, 'id'>) => {
    setSettings((prev) => ({
      ...prev,
      team: {
        ...prev.team,
        members: [...prev.team.members, { ...member, id: generateId() }],
      },
    }));
  }, []);

  const removeTeamMember = useCallback((memberId: string) => {
    setSettings((prev) => ({
      ...prev,
      team: {
        ...prev.team,
        members: prev.team.members.filter((m) => m.id !== memberId),
      },
    }));
  }, []);

  const updateTeamMember = useCallback((memberId: string, updates: Partial<TeamMember>) => {
    setSettings((prev) => ({
      ...prev,
      team: {
        ...prev.team,
        members: prev.team.members.map((m) =>
          m.id === memberId ? { ...m, ...updates } : m
        ),
      },
    }));
  }, []);

  // Category actions
  const addCategory = useCallback((category: Omit<Category, 'id'>) => {
    setSettings((prev) => ({
      ...prev,
      categories: [...prev.categories, { ...category, id: generateId() }],
    }));
  }, []);

  const removeCategory = useCallback((categoryId: string) => {
    setSettings((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== categoryId),
    }));
  }, []);

  const updateCategory = useCallback((categoryId: string, updates: Partial<Category>) => {
    setSettings((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.id === categoryId ? { ...c, ...updates } : c
      ),
    }));
  }, []);

  const reorderCategories = useCallback((categoryIds: string[]) => {
    setSettings((prev) => {
      const categoryMap = new Map(prev.categories.map((c) => [c.id, c]));
      const reordered = categoryIds
        .map((id, index) => {
          const category = categoryMap.get(id);
          return category ? { ...category, sortOrder: index } : null;
        })
        .filter((c): c is Category => c !== null);
      return { ...prev, categories: reordered };
    });
  }, []);

  // Notification actions
  const updateNotifications = useCallback((notifications: Partial<NotificationSettings>) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, ...notifications },
    }));
  }, []);

  // Preference actions
  const updatePreferences = useCallback((preferences: Partial<AppPreferences>) => {
    setSettings((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, ...preferences },
    }));
  }, []);

  // Theme shortcuts
  const setThemeMode = useCallback((mode: 'light' | 'dark') => {
    setSettings((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme: { ...prev.preferences.theme, mode },
      },
    }));
  }, []);

  const setThemeStyle = useCallback((style: ThemeStyle) => {
    setSettings((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme: { ...prev.preferences.theme, style },
      },
    }));
  }, []);

  // Utilities
  const resetToDefaults = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  const exportSettings = useCallback((): string => {
    return JSON.stringify(settings, null, 2);
  }, [settings]);

  const importSettings = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      setSettings(parsed);
      return true;
    } catch {
      return false;
    }
  }, []);

  const value: SettingsContextValue = {
    settings,
    isLoading,
    updateProfile,
    updateTeam,
    addTeamMember,
    removeTeamMember,
    updateTeamMember,
    addCategory,
    removeCategory,
    updateCategory,
    reorderCategories,
    updateNotifications,
    updatePreferences,
    setThemeMode,
    setThemeStyle,
    resetToDefaults,
    exportSettings,
    importSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

/**
 * Hook to get just the categories
 */
export function useCategories(): Category[] {
  const { settings } = useSettings();
  return settings.categories.filter((c) => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * Hook to get the user profile
 */
export function useUserProfile(): UserProfileSettings {
  const { settings } = useSettings();
  return settings.profile;
}

/**
 * Hook to get team settings
 */
export function useTeam(): TeamSettings {
  const { settings } = useSettings();
  return settings.team;
}
