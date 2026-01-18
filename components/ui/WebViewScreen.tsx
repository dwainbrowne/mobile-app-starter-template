/**
 * WebViewScreen Component
 *
 * A simple, seamless web view component that displays web pages within the app.
 * Blends in naturally as just another screen - no extra headers or navigation.
 * Features:
 * - Proper scrolling
 * - Loading states and error handling
 * - 5-minute local caching
 * - Theme-aware styling
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';

import { spacing } from '@/config';
import { useThemeColors } from '@/contexts/ThemeContext';
import { cacheUrlVisit, isUrlCached } from '@/services/webcache.service';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export interface WebViewScreenProps {
  /** URL to display */
  url: string;
  /** Page title (for caching purposes) */
  title?: string;
  /** Callback when page finishes loading */
  onLoadEnd?: () => void;
  /** Callback when an error occurs */
  onError?: (error: string) => void;
}

/**
 * WebViewScreen - Displays web content seamlessly within the app
 *
 * @example
 * <WebViewScreen url="https://example.com/docs" />
 */
export function WebViewScreen({
  url,
  title = 'Web Page',
  onLoadEnd,
  onError,
}: WebViewScreenProps) {
  const colors = useThemeColors();
  const webViewRef = useRef<WebView>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState(url);
  const [pageTitle, setPageTitle] = useState(title);
  const [refreshing, setRefreshing] = useState(false);

  // Check cache status on mount
  useEffect(() => {
    const checkCache = async () => {
      await isUrlCached(url, CACHE_TTL_MS);
    };
    checkCache();
  }, [url]);

  const handleLoadStart = () => {
    setIsLoading(true);
    setError(null);
  };

  const handleLoadEnd = async () => {
    setIsLoading(false);
    setRefreshing(false);

    // Cache this visit
    await cacheUrlVisit(currentUrl, pageTitle, CACHE_TTL_MS);

    onLoadEnd?.();
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    const errorMessage = nativeEvent.description || 'Failed to load page';
    setError(errorMessage);
    setIsLoading(false);
    setRefreshing(false);
    onError?.(errorMessage);
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    setCurrentUrl(navState.url);
    if (navState.title && navState.title !== 'about:blank') {
      setPageTitle(navState.title);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setError(null);
    webViewRef.current?.reload();
  }, []);

  const reload = () => {
    setError(null);
    webViewRef.current?.reload();
  };

  // For web platform, use iframe
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        {/* Loading overlay */}
        {isLoading && (
          <View style={[styles.loadingOverlay, { backgroundColor: colors.surface }]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Loading...
            </Text>
          </View>
        )}

        {/* Error state */}
        {error && (
          <View style={[styles.errorContainer, { backgroundColor: colors.surface }]}>
            <Ionicons name="cloud-offline" size={48} color={colors.danger} />
            <Text style={[styles.errorTitle, { color: colors.text }]}>
              Unable to load page
            </Text>
            <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
              {error}
            </Text>
            <Pressable
              style={[styles.retryButton, { backgroundColor: colors.primary }]}
              onPress={reload}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </Pressable>
          </View>
        )}

        {/* Web iframe */}
        {!error && (
          <iframe
            src={url}
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            onLoad={() => handleLoadEnd()}
            title={title}
          />
        )}
      </View>
    );
  }

  // Native platforms - use WebView
  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {error ? (
        <ScrollView
          contentContainerStyle={styles.errorScrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        >
          <View style={styles.errorContainer}>
            <Ionicons name="cloud-offline" size={48} color={colors.danger} />
            <Text style={[styles.errorTitle, { color: colors.text }]}>
              Unable to load page
            </Text>
            <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
              {error}
            </Text>
            <Pressable
              style={[styles.retryButton, { backgroundColor: colors.primary }]}
              onPress={handleRefresh}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </Pressable>
          </View>
        </ScrollView>
      ) : (
        <>
          {/* Loading overlay */}
          {isLoading && (
            <View style={[styles.loadingOverlay, { backgroundColor: colors.surface }]}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Loading...
              </Text>
            </View>
          )}
          <WebView
            ref={webViewRef}
            source={{ uri: url }}
            style={styles.webView}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            onError={handleError}
            onNavigationStateChange={handleNavigationStateChange}
            // Enable scrolling
            scrollEnabled
            bounces
            // Pull to refresh
            pullToRefreshEnabled
            // Allow inline media playback
            allowsInlineMediaPlayback
            // Allow full screen video
            allowsFullscreenVideo
            // Share cookies
            sharedCookiesEnabled
            // Enable JavaScript
            javaScriptEnabled
            // Enable DOM storage
            domStorageEnabled
            // Cache configuration
            cacheEnabled
            cacheMode="LOAD_CACHE_ELSE_NETWORK"
            // Security
            originWhitelist={['*']}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    zIndex: 10,
  },
  loadingText: {
    fontSize: 14,
  },
  errorScrollContent: {
    flex: 1,
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    marginTop: spacing.sm,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WebViewScreen;
