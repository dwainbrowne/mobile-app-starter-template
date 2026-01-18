import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { layout, shadows, spacing } from '@/config';
import { useThemeColors } from '@/contexts/ThemeContext';

interface RecurringItem {
  id: string;
  title: string;
  amount: number;
  frequency: string;
  nextDate: string;
  type: 'income' | 'expense';
}

// Sample data - replace with real data
const sampleRecurring: RecurringItem[] = [
  { id: '1', title: 'Salary', amount: 5000, frequency: 'Monthly', nextDate: 'Feb 1', type: 'income' },
  { id: '2', title: 'Rent', amount: -1500, frequency: 'Monthly', nextDate: 'Feb 1', type: 'expense' },
  { id: '3', title: 'Netflix', amount: -15.99, frequency: 'Monthly', nextDate: 'Feb 13', type: 'expense' },
  { id: '4', title: 'Gym Membership', amount: -49.99, frequency: 'Monthly', nextDate: 'Feb 5', type: 'expense' },
  { id: '5', title: 'Freelance Retainer', amount: 850, frequency: 'Monthly', nextDate: 'Feb 15', type: 'income' },
];

export default function RecurringScreen() {
  const colors = useThemeColors();

  const renderRecurringItem = ({ item }: { item: RecurringItem }) => (
    <View style={[styles.card, { backgroundColor: colors.background }]}>
      <View style={styles.cardHeader}>
        <View style={[
          styles.typeIndicator,
          { backgroundColor: item.type === 'income' ? colors.success : colors.danger }
        ]} />
        <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
      </View>
      <View style={styles.cardBody}>
        <View>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Amount</Text>
          <Text style={[
            styles.amount,
            { color: item.type === 'income' ? colors.success : colors.danger }
          ]}>
            {item.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </Text>
        </View>
        <View>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Frequency</Text>
          <Text style={[styles.value, { color: colors.text }]}>{item.frequency}</Text>
        </View>
        <View>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Next</Text>
          <Text style={[styles.value, { color: colors.text }]}>{item.nextDate}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <FlatList
        data={sampleRecurring}
        renderItem={renderRecurringItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Recurring Transactions</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {sampleRecurring.length} scheduled items
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
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
  card: {
    borderRadius: layout.cardRadius,
    padding: layout.cardPadding,
    ...shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
});
