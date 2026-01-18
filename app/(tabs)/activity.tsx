/**
 * Activity Logs Screen
 *
 * Navigation: Tabbed (keeps bottom tabs visible)
 * Access: Drawer menu → "Activity Logs"
 *
 * Shows user activity history and audit trail.
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Card } from '@/components/ui';
import { layout, spacing } from '@/config';
import { useThemeColors } from '@/contexts/ThemeContext';

interface ActivityItem {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  icon: keyof typeof Ionicons.glyphMap;
  type: 'add' | 'edit' | 'delete' | 'view' | 'sync';
}

const activityData: ActivityItem[] = [
  {
    id: '1',
    action: 'Transaction Added',
    description: 'Whole Foods - $125.50',
    timestamp: '2 hours ago',
    icon: 'add-circle',
    type: 'add',
  },
  {
    id: '2',
    action: 'Receipt Scanned',
    description: 'Shell Gas Station receipt uploaded',
    timestamp: '5 hours ago',
    icon: 'camera',
    type: 'add',
  },
  {
    id: '3',
    action: 'Budget Updated',
    description: 'Food category limit changed to $500',
    timestamp: 'Yesterday',
    icon: 'create',
    type: 'edit',
  },
  {
    id: '4',
    action: 'Recurring Payment Added',
    description: 'Netflix subscription - $15.99/month',
    timestamp: 'Yesterday',
    icon: 'repeat',
    type: 'add',
  },
  {
    id: '5',
    action: 'Data Synced',
    description: 'All devices synchronized',
    timestamp: 'Jan 15',
    icon: 'sync',
    type: 'sync',
  },
  {
    id: '6',
    action: 'Transaction Deleted',
    description: 'Duplicate entry removed',
    timestamp: 'Jan 14',
    icon: 'trash',
    type: 'delete',
  },
  {
    id: '7',
    action: 'Report Generated',
    description: 'Monthly summary for December',
    timestamp: 'Jan 10',
    icon: 'document-text',
    type: 'view',
  },
];

const getTypeColor = (type: ActivityItem['type'], colors: ReturnType<typeof useThemeColors>) => {
  switch (type) {
    case 'add':
      return colors.success;
    case 'edit':
      return colors.accent;
    case 'delete':
      return colors.danger;
    case 'sync':
      return colors.primary;
    default:
      return colors.textSecondary;
  }
};

export default function ActivityScreen() {
  const colors = useThemeColors();
  const [filter, setFilter] = useState<'all' | 'add' | 'edit' | 'delete'>('all');

  const filteredData = filter === 'all'
    ? activityData
    : activityData.filter((item) => item.type === filter);

  const FilterButton = ({ value, label }: { value: typeof filter; label: string }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor: filter === value ? colors.primary : colors.surface,
          borderColor: filter === value ? colors.primary : colors.border,
        },
      ]}
      onPress={() => setFilter(value)}
    >
      <Text
        style={[
          styles.filterText,
          { color: filter === value ? '#FFFFFF' : colors.text },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderActivity = ({ item }: { item: ActivityItem }) => (
    <Card style={styles.activityCard}>
      <View style={styles.activityRow}>
        <View
          style={[
            styles.activityIcon,
            { backgroundColor: getTypeColor(item.type, colors) + '20' },
          ]}
        >
          <Ionicons name={item.icon} size={20} color={getTypeColor(item.type, colors)} />
        </View>
        <View style={styles.activityContent}>
          <Text style={[styles.activityAction, { color: colors.text }]}>{item.action}</Text>
          <Text style={[styles.activityDescription, { color: colors.textSecondary }]}>
            {item.description}
          </Text>
          <Text style={[styles.activityTime, { color: colors.textSecondary }]}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <FlatList
        data={filteredData}
        renderItem={renderActivity}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Page Header */}
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Activity Logs</Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                Your recent actions
              </Text>
            </View>

            {/* Filter Buttons */}
            <View style={styles.filterContainer}>
              <FilterButton value="all" label="All" />
              <FilterButton value="add" label="Added" />
              <FilterButton value="edit" label="Edited" />
              <FilterButton value="delete" label="Deleted" />
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No activity found
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
  header: {
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
  },
  listContent: {
    padding: layout.screenPadding,
    paddingBottom: layout.tabBarPadding,
    gap: spacing.sm,
  },
  activityCard: {
    marginBottom: 0,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  activityAction: {
    fontSize: 15,
    fontWeight: '600',
  },
  activityDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: 15,
    marginTop: spacing.md,
  },
});
