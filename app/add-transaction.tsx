import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Card, CardSection, ScreenWrapper } from '@/components/ui';
import { spacing } from '@/config';
import { useThemeColors } from '@/contexts/ThemeContext';

/**
 * Add Transaction Screen
 *
 * Navigation: Standalone (no bottom tabs)
 * Access: Quick Actions menu → "Add Transaction"
 *
 * Form for adding new income or expense transactions.
 */

const categories = [
  { id: 'food', label: 'Food & Drink', icon: 'restaurant' },
  { id: 'transport', label: 'Transport', icon: 'car' },
  { id: 'shopping', label: 'Shopping', icon: 'bag' },
  { id: 'entertainment', label: 'Entertainment', icon: 'game-controller' },
  { id: 'bills', label: 'Bills', icon: 'receipt' },
  { id: 'income', label: 'Income', icon: 'wallet' },
];

export default function AddTransactionScreen() {
  const colors = useThemeColors();
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSave = () => {
    // TODO: Implement save logic
    console.log({ type, amount, description, selectedCategory });
  };

  return (
    <ScreenWrapper
      title="Add Transaction"
      subtitle="Record income or expense"
      mode="standalone"
      backIcon="close"
      rightContent={
        <TouchableOpacity onPress={handleSave}>
          <Text style={[styles.saveButton, { color: colors.primary }]}>Save</Text>
        </TouchableOpacity>
      }
    >
      {/* Transaction Type Toggle */}
      <View style={[styles.typeToggle, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            type === 'expense' && { backgroundColor: colors.danger },
          ]}
          onPress={() => setType('expense')}
        >
          <Text
            style={[
              styles.typeText,
              { color: type === 'expense' ? '#FFFFFF' : colors.text },
            ]}
          >
            Expense
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.typeButton,
            type === 'income' && { backgroundColor: colors.success },
          ]}
          onPress={() => setType('income')}
        >
          <Text
            style={[
              styles.typeText,
              { color: type === 'income' ? '#FFFFFF' : colors.text },
            ]}
          >
            Income
          </Text>
        </TouchableOpacity>
      </View>

      {/* Amount Input */}
      <CardSection title="Amount">
        <Card>
          <View style={styles.amountContainer}>
            <Text style={[styles.currency, { color: colors.textSecondary }]}>$</Text>
            <TextInput
              style={[styles.amountInput, { color: colors.text }]}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>
        </Card>
      </CardSection>

      {/* Description */}
      <CardSection title="Description">
        <Card>
          <TextInput
            style={[styles.descriptionInput, { color: colors.text }]}
            value={description}
            onChangeText={setDescription}
            placeholder="What was this for?"
            placeholderTextColor={colors.textSecondary}
          />
        </Card>
      </CardSection>

      {/* Category Selection */}
      <CardSection title="Category">
        <View style={styles.categoryGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryButton,
                { backgroundColor: colors.background },
                selectedCategory === cat.id && {
                  borderColor: colors.primary,
                  borderWidth: 2,
                },
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Ionicons
                name={cat.icon as keyof typeof Ionicons.glyphMap}
                size={24}
                color={selectedCategory === cat.id ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.categoryLabel,
                  {
                    color: selectedCategory === cat.id ? colors.primary : colors.text,
                  },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </CardSection>

      {/* Date (Today by default) */}
      <CardSection title="Date">
        <Card>
          <TouchableOpacity style={styles.dateRow}>
            <Ionicons name="calendar" size={20} color={colors.primary} />
            <Text style={[styles.dateText, { color: colors.text }]}>Today</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </Card>
      </CardSection>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  typeToggle: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: spacing.lg,
  },
  typeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    alignItems: 'center',
  },
  typeText: {
    fontSize: 15,
    fontWeight: '600',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currency: {
    fontSize: 32,
    fontWeight: '300',
    marginRight: spacing.xs,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '600',
  },
  descriptionInput: {
    fontSize: 16,
    paddingVertical: spacing.xs,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryButton: {
    width: '31%',
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    gap: spacing.xs,
  },
  categoryLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
  },
});
