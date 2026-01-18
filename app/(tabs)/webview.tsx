/**
 * WebView Tab Screen
 *
 * A screen that displays web content while maintaining the bottom tab bar.
 * This screen is hidden from the tab bar but accessible via drawer navigation.
 *
 * Navigation: Tabbed (keeps bottom tabs visible)
 * Access: Drawer menu → Web page items
 *
 * Query Parameters:
 * - url: The URL to display (required)
 * - title: The page title (optional)
 * - subtitle: Optional subtitle
 *
 * @example
 * router.push({
 *   pathname: '/(tabs)/webview',
 *   params: { url: 'https://example.com', title: 'Example Site' }
 * });
 */

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { WebViewScreen } from '@/components/ui/WebViewScreen';
import { spacing } from '@/config';
import { useThemeColors } from '@/contexts/ThemeContext';

export default function WebViewTabScreen() {
  const colors = useThemeColors();
  const params = useLocalSearchParams();

  const url = params.url as string | undefined;
  const title = (params.title as string) || 'Web Page';

  // Show error if no URL provided
  if (!url) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <View style={styles.errorContent}>
          <Ionicons name="warning" size={48} color={colors.warning} />
          <Text style={[styles.errorTitle, { color: colors.text }]}>
            Unable to Load
          </Text>
          <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
            This page requires a URL to display web content.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* WebView content - full screen, web page provides its own header */}
      <WebViewScreen
        url={decodeURIComponent(url)}
        title={title}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
