/**
 * What-If Scenarios Screen
 *
 * Navigation: Tabbed (keeps bottom tabs visible)
 * Access: Drawer menu → "What-If Scenarios"
 *
 * Allows users to simulate financial scenarios.
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, CardSection } from '@/components/ui';
import { layout, spacing } from '@/config';
import { useThemeColors } from '@/contexts/ThemeContext';

interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const scenarios: Scenario[] = [
  {
    id: '1',
    title: 'Salary Increase',
    description: 'What if you got a 10% raise?',
    icon: 'trending-up',
    color: '#10B981',
  },
  {
    id: '2',
    title: 'New Expense',
    description: 'Add a hypothetical recurring expense',
    icon: 'card',
    color: '#EF4444',
  },
  {
    id: '3',
    title: 'Savings Goal',
    description: 'How long to save for a big purchase?',
    icon: 'wallet',
    color: '#6366F1',
  },
  {
    id: '4',
    title: 'Budget Adjustment',
    description: 'Reallocate your budget categories',
    icon: 'pie-chart',
    color: '#F59E0B',
  },
];

export default function ScenariosScreen() {
  const colors = useThemeColors();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.surface }]}
      contentContainerStyle={styles.content}
    >
      {/* Page Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>What-If Scenarios</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Explore financial possibilities
        </Text>
      </View>

      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Create hypothetical scenarios to see how changes would affect your finances.
      </Text>

      <CardSection title="Available Scenarios">
        {scenarios.map((scenario) => (
          <Card key={scenario.id} style={styles.scenarioCard}>
            <View style={styles.scenarioContent}>
              <View style={[styles.iconContainer, { backgroundColor: scenario.color + '20' }]}>
                <Ionicons name={scenario.icon} size={24} color={scenario.color} />
              </View>
              <View style={styles.scenarioText}>
                <Text style={[styles.scenarioTitle, { color: colors.text }]}>
                  {scenario.title}
                </Text>
                <Text style={[styles.scenarioDescription, { color: colors.textSecondary }]}>
                  {scenario.description}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </Card>
        ))}
      </CardSection>

      <CardSection title="Saved Scenarios">
        <Card>
          <View style={styles.emptyState}>
            <Ionicons name="bookmark-outline" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No saved scenarios</Text>
            <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
              Create a scenario above and save it for future reference.
            </Text>
          </View>
        </Card>
      </CardSection>
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
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  scenarioCard: {
    marginBottom: spacing.sm,
  },
  scenarioContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scenarioText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  scenarioTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  scenarioDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: spacing.md,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
