import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { appIdentity, layout, shadows, spacing } from '@/config';
import { useThemeColors } from '@/contexts/ThemeContext';

/**
 * Overview Screen - Main dashboard/home screen
 *
 * This is a placeholder that you can customize for your specific app.
 * The shell (header, drawer, tabs) is handled by the layout.
 */
export default function OverviewScreen() {
  const colors = useThemeColors();
  const { appName } = appIdentity;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.surface }]}
      contentContainerStyle={styles.content}
    >
      {/* Page Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Overview</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Your financial snapshot at a glance
        </Text>
      </View>

      {/* Hero Section */}
      <View style={[styles.heroCard, { backgroundColor: colors.background }]}>
        <Text style={[styles.heroTitle, { color: colors.primary }]}>
          Welcome to {appName}
        </Text>
        <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
          Your main content goes here
        </Text>
      </View>

      {/* Placeholder Cards */}
      <View style={styles.cardGrid}>
        <View style={[styles.card, { backgroundColor: colors.background }]}>
          <View style={[styles.cardIcon, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.cardIconText, { color: colors.primary }]}>📊</Text>
          </View>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Analytics</Text>
          <Text style={[styles.cardValue, { color: colors.primary }]}>$128.4k</Text>
          <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Total Value</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.background }]}>
          <View style={[styles.cardIcon, { backgroundColor: colors.danger + '20' }]}>
            <Text style={[styles.cardIconText, { color: colors.danger }]}>📈</Text>
          </View>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Expenses</Text>
          <Text style={[styles.cardValue, { color: colors.danger }]}>$77.4k</Text>
          <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>This Year</Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={[styles.infoCard, { backgroundColor: colors.background }]}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>
          🎯 Getting Started
        </Text>
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          This is a generic app shell. Customize the content in each tab screen,
          or configure the navigation in <Text style={{ fontWeight: '600' }}>config/app.config.ts</Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: layout.screenPadding,
    paddingBottom: layout.tabBarPadding,
    gap: layout.listItemGap,
  },
  header: {
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  heroCard: {
    borderRadius: layout.cardRadius,
    padding: spacing.xxl,
    alignItems: 'center',
    ...shadows.card,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
  },
  cardGrid: {
    flexDirection: 'row',
    gap: layout.listItemGap,
  },
  card: {
    flex: 1,
    borderRadius: layout.cardRadius,
    padding: layout.cardPadding,
    ...shadows.card,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardIconText: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  cardLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  infoCard: {
    borderRadius: layout.cardRadius,
    padding: spacing.xl,
    ...shadows.card,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
