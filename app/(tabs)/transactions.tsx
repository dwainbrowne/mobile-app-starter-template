import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { layout, shadows } from '@/config';
import { useThemeColors } from '@/contexts/ThemeContext';

interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

// Sample data - replace with real data
const sampleTransactions: Transaction[] = [
  { id: '1', title: 'Salary', category: 'Income', amount: 5000, date: 'Jan 15', type: 'income' },
  { id: '2', title: 'Groceries', category: 'Food', amount: -125.50, date: 'Jan 14', type: 'expense' },
  { id: '3', title: 'Netflix', category: 'Entertainment', amount: -15.99, date: 'Jan 13', type: 'expense' },
  { id: '4', title: 'Freelance Work', category: 'Income', amount: 850, date: 'Jan 12', type: 'income' },
  { id: '5', title: 'Gas Station', category: 'Transport', amount: -45.00, date: 'Jan 11', type: 'expense' },
];

export default function TransactionsScreen() {
  const colors = useThemeColors();

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={[styles.transactionItem, { backgroundColor: colors.background }]}>
      <View style={styles.transactionLeft}>
        <View style={[
          styles.transactionIcon,
          { backgroundColor: item.type === 'income' ? colors.success + '20' : colors.danger + '20' }
        ]}>
          <Text>{item.type === 'income' ? '↓' : '↑'}</Text>
        </View>
        <View>
          <Text style={[styles.transactionTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.transactionCategory, { color: colors.textSecondary }]}>{item.category}</Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text style={[
          styles.transactionAmount,
          { color: item.type === 'income' ? colors.success : colors.danger }
        ]}>
          {item.type === 'income' ? '+' : ''}{item.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </Text>
        <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <FlatList
        data={sampleTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Recent Transactions</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Track your income and expenses
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No transactions yet
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
  },
  header: {
    marginBottom: layout.sectionMargin,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: layout.cardPadding,
    borderRadius: layout.cardRadius,
    ...shadows.card,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  transactionCategory: {
    fontSize: 13,
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: 12,
    marginTop: 2,
  },
  separator: {
    height: layout.listItemGap,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});
