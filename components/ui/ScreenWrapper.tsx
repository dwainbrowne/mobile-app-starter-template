import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { layout, spacing } from '@/config';
import { useThemeColors } from '@/contexts/ThemeContext';

/**
 * Navigation Mode for screens
 *
 * - 'standalone': Full-screen without bottom tabs (modal-like)
 *   - Shows custom header with back/close button
 *   - Used for: settings, notifications, modal screens, add forms
 *
 * - 'tabbed': Screen within the tab navigator
 *   - Uses AppShell header (hamburger menu, title, notifications)
 *   - Bottom tabs remain visible
 *   - Used for: main tab screens (overview, transactions, receipts, recurring)
 */
export type NavigationMode = 'standalone' | 'tabbed';

export interface ScreenWrapperProps {
  /** Screen title displayed in the header */
  title: string;
  /** Optional subtitle displayed below the title */
  subtitle?: string;
  /** Navigation mode - 'standalone' (no tabs) or 'tabbed' (with tabs) */
  mode?: NavigationMode;
  /** Icon for the back button - 'close' (X) or 'back' (arrow) */
  backIcon?: 'close' | 'back';
  /** Custom right header content */
  rightContent?: React.ReactNode;
  /** Whether to use ScrollView (default) or View for content */
  scrollable?: boolean;
  /** Children content */
  children: React.ReactNode;
}

/**
 * ScreenWrapper - Standardized screen container with consistent navigation
 *
 * Provides two navigation modes:
 *
 * 1. STANDALONE MODE (default for non-tab screens):
 *    - Full-screen overlay (covers bottom tabs)
 *    - Custom header with back/close button
 *    - Use for: settings, forms, detail views, modals
 *
 * 2. TABBED MODE (for tab screens):
 *    - Content only, header handled by AppShell
 *    - Bottom tabs remain visible
 *    - Use for: main navigation screens
 *
 * @example
 * // Standalone screen (settings, modal, etc.)
 * <ScreenWrapper title="Settings" mode="standalone" backIcon="close">
 *   <YourContent />
 * </ScreenWrapper>
 *
 * @example
 * // Tabbed screen content (within tab navigator)
 * <ScreenWrapper title="Transactions" subtitle="Track your spending" mode="tabbed">
 *   <YourContent />
 * </ScreenWrapper>
 */
export function ScreenWrapper({
  title,
  subtitle,
  mode = 'standalone',
  backIcon = 'close',
  rightContent,
  scrollable = true,
  children,
}: ScreenWrapperProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  // For tabbed mode, just render the content without header
  if (mode === 'tabbed') {
    const ContentWrapper = scrollable ? ScrollView : View;
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <ContentWrapper
          style={styles.content}
          contentContainerStyle={scrollable ? styles.scrollContent : undefined}
        >
          {/* Page Header */}
          <View style={styles.pageHeader}>
            <Text style={[styles.pageTitle, { color: colors.text }]}>{title}</Text>
            {subtitle && (
              <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
                {subtitle}
              </Text>
            )}
          </View>
          {children}
        </ContentWrapper>
      </View>
    );
  }

  // Standalone mode - full screen with custom header
  const ContentWrapper = scrollable ? ScrollView : View;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons
            name={backIcon === 'close' ? 'close' : 'arrow-back'}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
        <View style={styles.headerRight}>
          {rightContent || <View style={styles.placeholder} />}
        </View>
      </View>

      {/* Content */}
      <ContentWrapper
        style={styles.content}
        contentContainerStyle={scrollable ? styles.scrollContentStandalone : undefined}
      >
        {children}
      </ContentWrapper>
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: layout.screenPadding,
    paddingBottom: layout.tabBarPadding,
    gap: layout.listItemGap,
  },
  scrollContentStandalone: {
    padding: layout.screenPadding,
    paddingBottom: spacing.xxl,
    gap: layout.listItemGap,
  },
  pageHeader: {
    marginBottom: spacing.sm,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  pageSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default ScreenWrapper;
