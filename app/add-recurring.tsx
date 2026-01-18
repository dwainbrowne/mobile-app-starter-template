import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Card, CardSection, ScreenWrapper } from '@/components/ui';
import { spacing } from '@/config';
import { useThemeColors } from '@/contexts/ThemeContext';

/**
 * Add Recurring Transaction Screen
 *
 * Navigation: Standalone (no bottom tabs)
 * Access: Quick Actions menu → "Add Recurring"
 *
 * Form for adding recurring income or expenses (subscriptions, bills, salary, etc.)
 */

const frequencies = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'biweekly', label: 'Bi-weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'quarterly', label: 'Quarterly' },
  { id: 'yearly', label: 'Yearly' },
];

const categories = [
  { id: 'subscription', label: 'Subscription', icon: 'play-circle' },
  { id: 'bills', label: 'Bills', icon: 'flash' },
  { id: 'rent', label: 'Rent/Mortgage', icon: 'home' },
  { id: 'insurance', label: 'Insurance', icon: 'shield-checkmark' },
  { id: 'salary', label: 'Salary', icon: 'cash' },
  { id: 'other', label: 'Other', icon: 'ellipsis-horizontal' },
];

export default function AddRecurringScreen() {
  const colors = useThemeColors();
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState('monthly');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSave = () => {
    // TODO: Implement save logic
    console.log({ type, amount, title, selectedFrequency, selectedCategory });
  };

  return (
    <ScreenWrapper
      title="Add Recurring"
      subtitle="Set up recurring transactions"
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

      {/* Title */}
      <CardSection title="Name">
        <Card>
          <TextInput
            style={[styles.titleInput, { color: colors.text }]}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Netflix, Rent, Salary"
            placeholderTextColor={colors.textSecondary}
          />
        </Card>
      </CardSection>

      {/* Amount */}
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

      {/* Frequency */}
      <CardSection title="Frequency">
        <View style={styles.frequencyGrid}>
          {frequencies.map((freq) => (
            <TouchableOpacity
              key={freq.id}
              style={[
                styles.frequencyButton,
                {
                  backgroundColor:
                    selectedFrequency === freq.id ? colors.primary : colors.background,
                  borderColor:
                    selectedFrequency === freq.id ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setSelectedFrequency(freq.id)}
            >
              <Text
                style={[
                  styles.frequencyText,
                  {
                    color: selectedFrequency === freq.id ? '#FFFFFF' : colors.text,
                  },
                ]}
              >
                {freq.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </CardSection>

      {/* Category */}
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

      {/* Start Date */}
      <CardSection title="Start Date">
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
  titleInput: {
    fontSize: 16,
    paddingVertical: spacing.xs,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currency: {
    fontSize: 28,
    fontWeight: '300',
    marginRight: spacing.xs,
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '600',
  },
  frequencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  frequencyButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
  },
  frequencyText: {
    fontSize: 13,
    fontWeight: '500',
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
    fontSize: 11,
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
