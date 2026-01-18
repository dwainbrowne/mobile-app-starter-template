/**
 * Theme Interfaces
 *
 * Type definitions for the multi-theme system supporting
 * multiple light and dark theme variants.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * AVAILABLE THEMES
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * LIGHT THEMES:
 * - 'grey': Clean neutral light theme (default)
 * - 'emerald': Fresh green-tinted light theme
 * - 'violet': Purple/blue gradient light theme
 *
 * DARK THEMES:
 * - 'grey': Classic neutral dark theme
 * - 'forest': Nature-inspired green dark theme
 * - 'ocean': Deep blue oceanic dark theme
 * - 'midnight': Pure black OLED-friendly theme
 *
 * To change the default theme, update `defaultThemeConfig` in themes.ts
 */

/**
 * Available theme style identifiers for BOTH light and dark modes
 * - 'grey': Neutral (available in light + dark)
 * - 'emerald': Green-tinted (light only, falls back to forest in dark)
 * - 'violet': Purple-blue (light only, falls back to midnight in dark)
 * - 'forest': Green (dark only, falls back to emerald in light)
 * - 'ocean': Blue (dark only, falls back to grey in light)
 * - 'midnight': Pure black (dark only, falls back to grey in light)
 */
export type ThemeStyle = 'grey' | 'emerald' | 'violet' | 'forest' | 'ocean' | 'midnight';

/**
 * Theme mode (light or dark)
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Complete color palette for a theme
 */
export interface ThemePalette {
  // Brand colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string; // Orange for buttons/CTAs

  // Semantic colors
  danger: string;
  success: string;
  warning: string;
  info: string;

  // Background colors
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceElevated: string;

  // Text colors
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  // UI colors
  border: string;
  borderLight: string;
  divider: string;
  overlay: string;

  // Interactive states
  ripple: string;
  highlight: string;
  disabled: string;

  // Tab/Navigation
  tabIconDefault: string;
  tabIconSelected: string;
  tint: string;
}

/**
 * Theme definition including metadata
 */
export interface ThemeDefinition {
  id: ThemeStyle;
  name: string;
  description: string;
  isDark: boolean;
  palette: ThemePalette;
}

/**
 * Theme configuration for storage/settings
 */
export interface ThemeConfig {
  mode: ThemeMode;
  style: ThemeStyle;
}

/**
 * Theme context value
 */
export interface ThemeContextValue {
  // Current state
  mode: ThemeMode;
  style: ThemeStyle;
  isDark: boolean;
  colors: ThemePalette;
  theme: ThemeDefinition;

  // Actions
  setMode: (mode: ThemeMode) => void;
  setStyle: (style: ThemeStyle) => void;
  toggleMode: () => void;

  // Utilities
  getAvailableStyles: () => ThemeDefinition[];
}
