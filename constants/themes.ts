/**
 * Theme Definitions
 *
 * Multi-theme system with support for:
 * - Light mode: Grey (default), Emerald (green), Violet (purple-blue)
 * - Dark mode: Grey, Forest, Ocean, Midnight
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * THEME OVERVIEW
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * LIGHT THEMES:
 * - Grey:    Clean neutral light theme - professional, minimal
 * - Emerald: Fresh green theme
 * - Violet:  Purple/blue gradient theme
 *
 * DARK THEMES:
 * - Grey:     Classic neutral dark (default)
 * - Forest:   Nature-inspired green
 * - Ocean:    Deep blue oceanic
 * - Midnight: Pure black OLED-friendly
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * HOW TO CHANGE DEFAULT THEME
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Update `defaultThemeConfig` at the bottom of this file:
 * - mode: 'light' or 'dark'
 * - style: 'grey', 'emerald', 'violet', 'forest', 'ocean', or 'midnight'
 *
 * Brand colors: Purple-Blue primary with Orange accent/buttons
 */

import type { ThemeDefinition, ThemeStyle } from '@/interfaces/theme';

// ===========================================
// SHARED BRAND COLORS
// ===========================================

const brandColors = {
  // Primary purple-blue (SnapSuite brand gradient)
  primary: '#7B42F6', // SnapSuite Purple
  primaryLight: '#9B6BFA', // Lighter purple
  primaryDark: '#5B2BD4', // Deeper purple

  // Secondary blue (gradient end)
  secondary: '#4A7CF7', // SnapSuite Blue

  // Accent green for action buttons
  accent: '#10B981', // Green (Quick Clock In, Accept)

  // Semantic colors
  danger: '#EF4444', // Red-500
  success: '#10B981', // Emerald-500
  warning: '#F59E0B', // Amber-500
  info: '#3B82F6', // Blue-500
};

// ===========================================
// LIGHT THEMES
// ===========================================

/**
 * Grey Light Theme (Default)
 * Clean and bright neutral theme
 */
export const greyLightTheme: ThemeDefinition = {
  id: 'grey' as ThemeStyle,
  name: 'Light',
  description: 'Clean and bright light theme',
  isDark: false,
  palette: {
    ...brandColors,

    // Backgrounds - Light gray-blue surface for card separation
    background: '#FFFFFF',
    backgroundSecondary: '#F8FAFC',
    surface: '#F1F5F9', // Slate-100 - provides visual separation for cards
    surfaceElevated: '#FFFFFF',

    // Text
    text: '#1E293B',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    textInverse: '#FFFFFF',

    // UI
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    divider: '#E2E8F0',
    overlay: 'rgba(0, 0, 0, 0.5)',

    // Interactive
    ripple: 'rgba(99, 102, 241, 0.1)',
    highlight: 'rgba(99, 102, 241, 0.05)',
    disabled: '#CBD5E1',

    // Navigation
    tabIconDefault: '#64748B',
    tabIconSelected: '#6366F1',
    tint: '#6366F1',
  },
};

/**
 * Emerald Light Theme
 * Fresh green-tinted light theme
 * Primary color: Emerald green (#10B981)
 */
export const emeraldLightTheme: ThemeDefinition = {
  id: 'emerald' as ThemeStyle,
  name: 'Emerald',
  description: 'Fresh green light theme',
  isDark: false,
  palette: {
    // Override brand colors for emerald theme
    primary: '#10B981',       // Emerald-500
    primaryLight: '#34D399',  // Emerald-400
    primaryDark: '#059669',   // Emerald-600
    secondary: '#14B8A6',     // Teal-500
    accent: '#F97316',        // Orange-500
    danger: '#EF4444',
    success: '#22C55E',
    warning: '#F59E0B',
    info: '#06B6D4',

    // Backgrounds - Light gray-green surface for card separation
    background: '#FFFFFF',
    backgroundSecondary: '#F0FDF4', // Emerald-50
    surface: '#ECFDF5', // Emerald-50 lighter - provides visual separation for cards
    surfaceElevated: '#FFFFFF',

    // Text
    text: '#1E293B',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    textInverse: '#FFFFFF',

    // UI - Green-tinted borders
    border: '#D1FAE5', // Emerald-100
    borderLight: '#ECFDF5', // Emerald-50
    divider: '#D1FAE5',
    overlay: 'rgba(0, 0, 0, 0.5)',

    // Interactive
    ripple: 'rgba(16, 185, 129, 0.1)',
    highlight: 'rgba(16, 185, 129, 0.05)',
    disabled: '#CBD5E1',

    // Navigation
    tabIconDefault: '#64748B',
    tabIconSelected: '#10B981',
    tint: '#10B981',
  },
};

/**
 * Violet Light Theme
 * Purple/blue gradient light theme (SnapSuite's purple branding)
 * Primary color: SnapSuite Purple (#7B42F6)
 */
export const violetLightTheme: ThemeDefinition = {
  id: 'violet' as ThemeStyle,
  name: 'Violet',
  description: 'SnapSuite purple-blue theme',
  isDark: false,
  palette: {
    // SnapSuite brand colors
    primary: '#7B42F6',       // SnapSuite Purple
    primaryLight: '#9B6BFA',  // Lighter purple
    primaryDark: '#5B2BD4',   // Deeper purple
    secondary: '#4A7CF7',     // SnapSuite Blue
    accent: '#10B981',        // Green (action buttons)
    danger: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',

    // Backgrounds - Light surfaces matching screenshots
    background: '#FFFFFF',
    backgroundSecondary: '#F5F3FF', // Violet-50
    surface: '#F3F4F6', // Gray-100 (screenshot body background)
    surfaceElevated: '#FFFFFF',

    // Text
    text: '#1F2937',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    textInverse: '#FFFFFF',

    // UI
    border: '#E5E7EB', // Gray-200
    borderLight: '#F3F4F6', // Gray-100
    divider: '#E5E7EB',
    overlay: 'rgba(0, 0, 0, 0.5)',

    // Interactive
    ripple: 'rgba(123, 66, 246, 0.1)',
    highlight: 'rgba(123, 66, 246, 0.05)',
    disabled: '#D1D5DB',

    // Navigation
    tabIconDefault: '#6B7280',
    tabIconSelected: '#7B42F6',
    tint: '#7B42F6',
  },
};

// ===========================================
// DARK THEMES
// ===========================================

/**
 * Grey Dark Theme
 * Neutral, professional dark theme
 */
export const greyDarkTheme: ThemeDefinition = {
  id: 'grey',
  name: 'Grey',
  description: 'Classic neutral dark theme',
  isDark: true,
  palette: {
    ...brandColors,

    // Backgrounds - Slate tones
    background: '#0F172A',
    backgroundSecondary: '#1E293B',
    surface: '#1E293B',
    surfaceElevated: '#334155',

    // Text
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textInverse: '#0F172A',

    // UI
    border: '#334155',
    borderLight: '#475569',
    divider: '#334155',
    overlay: 'rgba(0, 0, 0, 0.7)',

    // Interactive
    ripple: 'rgba(99, 102, 241, 0.2)',
    highlight: 'rgba(99, 102, 241, 0.1)',
    disabled: '#475569',

    // Navigation
    tabIconDefault: '#64748B',
    tabIconSelected: '#818CF8',
    tint: '#818CF8',
  },
};

/**
 * Forest Dark Theme
 * Green-tinted dark theme with earthy tones
 */
export const forestDarkTheme: ThemeDefinition = {
  id: 'forest',
  name: 'Forest',
  description: 'Nature-inspired green dark theme',
  isDark: true,
  palette: {
    ...brandColors,

    // Backgrounds - Green/forest tones
    background: '#0D1912',
    backgroundSecondary: '#162419',
    surface: '#1A2E1F',
    surfaceElevated: '#243D2A',

    // Text
    text: '#E8F5E9',
    textSecondary: '#A5D6A7',
    textMuted: '#66BB6A',
    textInverse: '#0D1912',

    // UI
    border: '#2E5735',
    borderLight: '#388E3C',
    divider: '#2E5735',
    overlay: 'rgba(0, 0, 0, 0.7)',

    // Interactive
    ripple: 'rgba(99, 102, 241, 0.2)',
    highlight: 'rgba(99, 102, 241, 0.1)',
    disabled: '#2E5735',

    // Navigation
    tabIconDefault: '#66BB6A',
    tabIconSelected: '#81C784',
    tint: '#81C784',
  },
};

/**
 * Ocean Dark Theme
 * Blue-tinted dark theme with deep sea tones
 */
export const oceanDarkTheme: ThemeDefinition = {
  id: 'ocean',
  name: 'Ocean',
  description: 'Deep blue oceanic dark theme',
  isDark: true,
  palette: {
    ...brandColors,

    // Backgrounds - Ocean blue tones
    background: '#0A1628',
    backgroundSecondary: '#102035',
    surface: '#132944',
    surfaceElevated: '#1A3A5C',

    // Text
    text: '#E0F2FE',
    textSecondary: '#7DD3FC',
    textMuted: '#38BDF8',
    textInverse: '#0A1628',

    // UI
    border: '#1E4976',
    borderLight: '#2563EB',
    divider: '#1E4976',
    overlay: 'rgba(0, 0, 0, 0.7)',

    // Interactive
    ripple: 'rgba(99, 102, 241, 0.2)',
    highlight: 'rgba(99, 102, 241, 0.1)',
    disabled: '#1E4976',

    // Navigation
    tabIconDefault: '#38BDF8',
    tabIconSelected: '#7DD3FC',
    tint: '#7DD3FC',
  },
};

/**
 * Midnight Dark Theme
 * Pure black OLED-friendly theme with purple accents
 */
export const midnightDarkTheme: ThemeDefinition = {
  id: 'midnight',
  name: 'Midnight',
  description: 'Pure black OLED-friendly theme',
  isDark: true,
  palette: {
    ...brandColors,

    // Backgrounds - Pure blacks
    background: '#000000',
    backgroundSecondary: '#0A0A0A',
    surface: '#121212',
    surfaceElevated: '#1A1A1A',

    // Text
    text: '#FAFAFA',
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',
    textInverse: '#000000',

    // UI
    border: '#27272A',
    borderLight: '#3F3F46',
    divider: '#27272A',
    overlay: 'rgba(0, 0, 0, 0.8)',

    // Interactive
    ripple: 'rgba(139, 92, 246, 0.2)',
    highlight: 'rgba(139, 92, 246, 0.1)',
    disabled: '#3F3F46',

    // Navigation
    tabIconDefault: '#71717A',
    tabIconSelected: '#A78BFA',
    tint: '#A78BFA',
  },
};

// ===========================================
// THEME REGISTRY
// ===========================================

/**
 * All available light themes
 */
export const lightThemes: Record<string, ThemeDefinition> = {
  grey: greyLightTheme,
  emerald: emeraldLightTheme,
  violet: violetLightTheme,
};

/**
 * All available dark themes
 */
export const darkThemes: Record<ThemeStyle, ThemeDefinition> = {
  grey: greyDarkTheme,
  forest: forestDarkTheme,
  ocean: oceanDarkTheme,
  midnight: midnightDarkTheme,
  // Map light-only styles to their dark equivalents
  emerald: forestDarkTheme,  // Emerald maps to Forest in dark mode
  violet: midnightDarkTheme, // Violet maps to Midnight in dark mode
};

/**
 * Get theme by mode and style
 * Automatically maps styles between light/dark modes when needed
 */
export function getTheme(isDark: boolean, style: ThemeStyle): ThemeDefinition {
  if (!isDark) {
    // Light mode
    return lightThemes[style] || greyLightTheme;
  }
  // Dark mode
  return darkThemes[style] || greyDarkTheme;
}

/**
 * Get all available light theme options
 */
export function getLightThemeOptions(): ThemeDefinition[] {
  return Object.values(lightThemes);
}

/**
 * Get all available dark theme options
 */
export function getDarkThemeOptions(): ThemeDefinition[] {
  // Only return unique dark themes (exclude mapped light themes)
  return [greyDarkTheme, forestDarkTheme, oceanDarkTheme, midnightDarkTheme];
}

/**
 * Get all theme options for current mode
 */
export function getThemeOptionsForMode(isDark: boolean): ThemeDefinition[] {
  return isDark ? getDarkThemeOptions() : getLightThemeOptions();
}

/**
 * Default theme configuration
 * 
 * Change these values to set the app's default theme:
 * - mode: 'light' or 'dark'
 * - style: 'grey', 'emerald', 'violet', 'forest', 'ocean', or 'midnight'
 */
export const defaultThemeConfig = {
  mode: 'light' as const,
  style: 'violet' as ThemeStyle,
};
