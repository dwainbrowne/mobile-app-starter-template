import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColors } from '@/contexts/ThemeContext';

export type ThemedTextProps = TextProps & {
  variant?: 'primary' | 'secondary' | 'muted' | 'inverse' | 'accent';
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  variant = 'primary',
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const colors = useThemeColors();

  const color =
    variant === 'secondary' ? colors.textSecondary :
      variant === 'muted' ? colors.textMuted :
        variant === 'inverse' ? colors.textInverse :
          variant === 'accent' ? colors.accent :
            colors.text;

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? [styles.link, { color: colors.primary }] : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
  },
});
