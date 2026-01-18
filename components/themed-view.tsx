import { View, type ViewProps } from 'react-native';

import { useThemeColors } from '@/contexts/ThemeContext';

export type ThemedViewProps = ViewProps & {
  variant?: 'background' | 'surface' | 'surfaceElevated';
};

export function ThemedView({ style, variant = 'background', ...otherProps }: ThemedViewProps) {
  const colors = useThemeColors();

  const backgroundColor = variant === 'surface'
    ? colors.surface
    : variant === 'surfaceElevated'
      ? colors.surfaceElevated
      : colors.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
