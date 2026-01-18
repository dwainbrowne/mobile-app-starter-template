import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { layout, shadows, spacing } from '@/config';
import { useThemeColors } from '@/contexts/ThemeContext';

/**
 * Notification Item Interface
 */
interface NotificationItem {
  id: string;
  type: 'message' | 'alert' | 'update' | 'video' | 'promo';
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  imageUrl?: string;
  videoThumbnail?: string;
  actionUrl?: string;
}

/**
 * Sample notifications data - replace with actual API data
 */
const sampleNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Budget Alert',
    body: 'You\'ve used 80% of your monthly food budget. Consider reviewing your spending.',
    timestamp: '2 hours ago',
    isRead: false,
  },
  {
    id: '2',
    type: 'update',
    title: 'New Feature: Receipt Scanning',
    body: 'We\'ve improved our receipt scanning accuracy by 40%. Try scanning your next receipt!',
    timestamp: '5 hours ago',
    isRead: false,
  },
  {
    id: '3',
    type: 'video',
    title: 'Quick Tip: Saving Money',
    body: 'Watch this 2-minute video on how to save 20% more each month with simple habits.',
    timestamp: 'Yesterday',
    isRead: true,
    videoThumbnail: 'https://picsum.photos/seed/video1/400/225',
  },
  {
    id: '4',
    type: 'message',
    title: 'Monthly Report Ready',
    body: 'Your January financial summary is ready to view. You saved $450 more than last month!',
    timestamp: 'Jan 15',
    isRead: true,
  },
  {
    id: '5',
    type: 'promo',
    title: 'Upgrade to Premium',
    body: 'Get unlimited receipt scans, advanced analytics, and team collaboration. 50% off this month!',
    timestamp: 'Jan 14',
    isRead: true,
    imageUrl: 'https://picsum.photos/seed/promo1/400/200',
  },
  {
    id: '6',
    type: 'alert',
    title: 'Recurring Payment Due',
    body: 'Your Netflix subscription ($15.99) will be charged tomorrow.',
    timestamp: 'Jan 12',
    isRead: true,
  },
  {
    id: '7',
    type: 'video',
    title: 'Getting Started Guide',
    body: 'New to the app? Watch this quick guide to make the most of your experience.',
    timestamp: 'Jan 10',
    isRead: true,
    videoThumbnail: 'https://picsum.photos/seed/video2/400/225',
  },
];

/**
 * Get icon for notification type
 */
const getNotificationIcon = (type: NotificationItem['type']): keyof typeof Ionicons.glyphMap => {
  switch (type) {
    case 'message':
      return 'mail';
    case 'alert':
      return 'warning';
    case 'update':
      return 'sparkles';
    case 'video':
      return 'play-circle';
    case 'promo':
      return 'gift';
    default:
      return 'notifications';
  }
};

/**
 * Get icon color for notification type
 */
const getNotificationColor = (type: NotificationItem['type'], colors: any): string => {
  switch (type) {
    case 'message':
      return colors.primary;
    case 'alert':
      return colors.warning;
    case 'update':
      return colors.info;
    case 'video':
      return colors.danger;
    case 'promo':
      return colors.success;
    default:
      return colors.textSecondary;
  }
};

/**
 * Notifications Screen
 *
 * Displays an inbox-style list of notifications with support for:
 * - Different notification types (messages, alerts, updates, videos, promos)
 * - Read/unread states
 * - Image and video thumbnail previews
 * - Mark all as read functionality
 */
export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const [notifications, setNotifications] = useState(sampleNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );
  };

  const handleNotificationPress = (notification: NotificationItem) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notification.id ? { ...n, isRead: true } : n
      )
    );

    // Handle action based on type or actionUrl
    // TODO: Implement navigation to relevant screens
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => {
    const iconColor = getNotificationColor(item.type, colors);

    return (
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: colors.background },
          !item.isRead && { borderLeftWidth: 3, borderLeftColor: colors.primary },
        ]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
            <Ionicons name={getNotificationIcon(item.type)} size={24} color={iconColor} />
          </View>

          {/* Content */}
          <View style={styles.details}>
            <Text
              style={[
                styles.title,
                { color: colors.text },
                !item.isRead && styles.titleUnread,
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text
              style={[styles.body, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {item.body}
            </Text>
            <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
              {item.timestamp}
            </Text>
          </View>

          {/* Chevron */}
          <View style={styles.chevronContainer}>
            {!item.isRead && (
              <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
            )}
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </View>
        </View>

        {/* Video Thumbnail */}
        {item.videoThumbnail && (
          <View style={styles.mediaContainer}>
            <Image
              source={{ uri: item.videoThumbnail }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <View style={styles.playButton}>
              <Ionicons name="play" size={32} color="#FFFFFF" />
            </View>
          </View>
        )}

        {/* Promo/Banner Image */}
        {item.imageUrl && !item.videoThumbnail && (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, paddingTop: insets.top },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.background, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Notifications
          </Text>
          {unreadCount > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllRead} style={styles.markReadButton}>
            <Text style={[styles.markReadText, { color: colors.primary }]}>
              Mark all read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={[styles.listHeaderTitle, { color: colors.text }]}>
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
            </Text>
            {unreadCount > 0 && (
              <TouchableOpacity onPress={handleMarkAllRead}>
                <Text style={[styles.markReadText, { color: colors.primary }]}>
                  Mark all read
                </Text>
              </TouchableOpacity>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="notifications-off-outline"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No notifications
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              You're all caught up! We'll notify you when there's something new.
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  markReadButton: {
    padding: spacing.sm,
  },
  markReadText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    padding: layout.screenPadding,
    paddingBottom: layout.tabBarPadding,
    gap: layout.listItemGap,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  listHeaderTitle: {
    fontSize: 14,
    fontWeight: '500',
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
    marginLeft: spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  titleUnread: {
    fontWeight: '600',
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  timestamp: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
  chevronContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  mediaContainer: {
    marginTop: spacing.md,
    borderRadius: layout.cardRadius,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 160,
    borderRadius: layout.cardRadius,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -24,
    marginLeft: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerImage: {
    width: '100%',
    height: 120,
    borderRadius: layout.cardRadius,
    marginTop: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
