/**
 * Theme Context
 *
 * Provides theme management with support for multiple dark theme styles.
 * Handles theme persistence and provides colors to the entire app.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import { defaultThemeConfig, getTheme, getThemeOptionsForMode } from '@/constants/themes';
import type { ThemeContextValue, ThemeDefinition, ThemeMode, ThemePalette, ThemeStyle } from '@/interfaces/theme';

const THEME_STORAGE_KEY = '@affordly/theme';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(defaultThemeConfig.mode);
  const [style, setStyleState] = useState<ThemeStyle>(defaultThemeConfig.style);
  const [isLoaded, setIsLoaded] = useState(false);

  // Derived values
  const isDark = mode === 'dark';
  const theme: ThemeDefinition = getTheme(isDark, style);
  const colors: ThemePalette = theme.palette;

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          const parsed = JSON.parse(savedTheme);
          if (parsed.mode) setModeState(parsed.mode);
          if (parsed.style) setStyleState(parsed.style);
        }
      } catch (error) {
        console.warn('Failed to load theme:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  // Save theme when it changes
  useEffect(() => {
    if (!isLoaded) return;

    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem(
          THEME_STORAGE_KEY,
          JSON.stringify({ mode, style })
        );
      } catch (error) {
        console.warn('Failed to save theme:', error);
      }
    };
    saveTheme();
  }, [mode, style, isLoaded]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
  }, []);

  const setStyle = useCallback((newStyle: ThemeStyle) => {
    setStyleState(newStyle);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const getAvailableStyles = useCallback((): ThemeDefinition[] => {
    return getThemeOptionsForMode(isDark);
  }, [isDark]);

  const value: ThemeContextValue = {
    mode,
    style,
    isDark,
    colors,
    theme,
    setMode,
    setStyle,
    toggleMode,
    getAvailableStyles,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Hook to get just the colors (convenience)
 */
export function useThemeColors(): ThemePalette {
  const { colors } = useTheme();
  return colors;
}

/**
 * Hook to check if dark mode is active
 */
export function useIsDark(): boolean {
  const { isDark } = useTheme();
  return isDark;
}
