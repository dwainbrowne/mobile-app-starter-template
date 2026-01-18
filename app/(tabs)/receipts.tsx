import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { layout, shadows, spacing } from '@/config';
import { useThemeColors } from '@/contexts/ThemeContext';

interface Receipt {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  category: string;
  hasImage: boolean;
}

// Sample data - replace with real data
const sampleReceipts: Receipt[] = [
  { id: '1', merchant: 'Whole Foods', amount: 125.50, date: 'Jan 14, 2026', category: 'Groceries', hasImage: true },
  { id: '2', merchant: 'Shell Gas Station', amount: 45.00, date: 'Jan 11, 2026', category: 'Transport', hasImage: true },
  { id: '3', merchant: 'Amazon', amount: 89.99, date: 'Jan 10, 2026', category: 'Shopping', hasImage: false },
  { id: '4', merchant: 'Starbucks', amount: 12.50, date: 'Jan 9, 2026', category: 'Food & Drink', hasImage: true },
];

export default function ReceiptsScreen() {
  const colors = useThemeColors();

  const renderReceipt = ({ item }: { item: Receipt }) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.background }]}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
          <Ionicons 
            name={item.hasImage ? 'document-text' : 'document-text-outline'} 
            size={24} 
            color={colors.primary} 
          />
        </View>
        <View style={styles.details}>
          <Text style={[styles.merchant, { color: colors.text }]}>{item.merchant}</Text>
          <Text style={[styles.category, { color: colors.textSecondary }]}>{item.category}</Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>{item.date}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={[styles.amount, { color: colors.text }]}>
            ${item.amount.toFixed(2)}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <FlatList
        data={sampleReceipts}
        renderItem={renderReceipt}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Receipts</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {sampleReceipts.length} captured receipts
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No receipts yet</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Tap the + button to add your first receipt
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
  cardContent: {
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
  details: {
    flex: 1,
    marginLeft: 12,
  },
  merchant: {
    fontSize: 16,
    fontWeight: '600',
  },
  category: {
    fontSize: 13,
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    marginTop: 2,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    padding: 60,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});
