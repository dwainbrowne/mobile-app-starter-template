import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/contexts/ThemeContext';

/**
 * Explore Screen - Placeholder
 *
 * This screen is hidden from navigation but kept as a template.
 * You can enable it by adding to tabs.navigation.ts config.
 */
export default function ExploreScreen() {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={[styles.card, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Explore</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          This is a placeholder screen. Enable it in tabs.navigation.ts
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});
