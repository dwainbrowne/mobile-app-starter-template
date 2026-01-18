import React, { ReactNode } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

export interface CardProps {
  /** Card content */
  children: ReactNode;
  /** Optional title for the card */
  title?: string;
  /** Optional subtitle for the card */
  subtitle?: string;
  /** Custom style for the card container */
  style?: ViewStyle;
  /** Padding size: 'none', 'small', 'medium', 'large' */
  padding?: 'none' | 'small' | 'medium' | 'large';
  /** Whether to show a shadow */
  elevated?: boolean;
}

/**
 * Card - A reusable card component for consistent styling
 * 
 * @example
 * ```tsx
 * <Card title="User Profile" subtitle="Your account details">
 *   <ProfileContent />
 * </Card>
 * ```
 */
export function Card({
  children,
  title,
  subtitle,
  style,
  padding = 'medium',
  elevated = false,
}: CardProps) {
  const { colors } = useTheme();

  const paddingValue = {
    none: 0,
    small: 12,
    medium: 16,
    large: 20,
  }[padding];

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface },
        elevated && styles.elevated,
        { padding: paddingValue },
        style,
      ]}
    >
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && (
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          )}
          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
      {children}
    </View>
  );
}

/**
 * CardSection - A section header for grouping cards
 */
export interface CardSectionProps {
  /** Section title */
  title: string;
  /** Cards to render in this section */
  children: ReactNode;
  /** Custom style for the section */
  style?: ViewStyle;
}

export function CardSection({ title, children, style }: CardSectionProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.section, style]}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

export default Card;
