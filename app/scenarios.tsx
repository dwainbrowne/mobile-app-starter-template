import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card, CardSection, ScreenWrapper } from '@/components/ui';
import { spacing } from '@/config';
import { useThemeColors } from '@/contexts/ThemeContext';

/**
 * What-If Scenarios Screen
 *
 * Navigation: Standalone (no bottom tabs)
 * Access: Drawer menu → "What-If Scenarios"
 *
 * Allows users to simulate financial scenarios.
 */

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
    <ScreenWrapper
      title="What-If Scenarios"
      subtitle="Explore financial possibilities"
      mode="standalone"
      backIcon="back"
    >
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
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.md,
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
