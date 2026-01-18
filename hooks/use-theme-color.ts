/**
 * Theme Color Hook
 *
 * Uses the new multi-theme system from ThemeContext.
 * For direct palette access, use useThemeColors() from ThemeContext.
 */

import { useThemeColors } from '@/contexts/ThemeContext';
import type { ThemePalette } from '@/interfaces/theme';

/**
 * Get a color from the current theme palette
 * @param props - Optional light/dark overrides
 * @param colorName - Key from ThemePalette
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof ThemePalette
) {
  const colors = useThemeColors();
  const isDark = colors.background === '#0F172A' || colors.background === '#000000';
  const mode = isDark ? 'dark' : 'light';
  const colorFromProps = props[mode];

  if (colorFromProps) {
    return colorFromProps;
  }
  return colors[colorName];
}
