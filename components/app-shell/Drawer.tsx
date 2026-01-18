import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { appFeatures, appIdentity, siteNavigation } from '@/config';
import { getFullVersionString } from '@/config/auth.config';
import { useAuth } from '@/contexts/AuthContext';
import { useDrawer } from '@/contexts/DrawerContext';
import { useDynamicTabs } from '@/contexts/DynamicTabContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { useThemeColors } from '@/contexts/ThemeContext';
import type { DrawerMenuItem } from '@/interfaces';

const DRAWER_WIDTH = 300;

export default function Drawer() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isOpen, closeDrawer } = useDrawer();
  const { user, signOut } = useAuth();
  const { openFeedbackModal } = useFeedback();
  const { setTabConfig, resetToDefault } = useDynamicTabs();
  const colors = useThemeColors();
  const features = appFeatures;
  const { appName } = appIdentity;
  const versionString = getFullVersionString();

  const translateX = useSharedValue(-DRAWER_WIDTH);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      // Smooth ease-out slide-in animation
      translateX.value = withTiming(0, { 
        duration: 300, 
        easing: Easing.out(Easing.cubic) 
      });
      overlayOpacity.value = withTiming(0.5, { 
        duration: 300, 
        easing: Easing.out(Easing.quad) 
      });
    } else {
      // Slightly faster ease-in slide-out
      translateX.value = withTiming(-DRAWER_WIDTH, { 
        duration: 250, 
        easing: Easing.in(Easing.cubic) 
      });
      overlayOpacity.value = withTiming(0, { 
        duration: 200, 
        easing: Easing.in(Easing.quad) 
      });
    }
  }, [isOpen, translateX, overlayOpacity]);

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    pointerEvents: isOpen ? 'auto' : 'none',
  }));

  const handleMenuItemPress = async (item: DrawerMenuItem) => {
    if (features.hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    closeDrawer();

    // Handle external URL (opens in system browser)
    if (item.url) {
      setTimeout(async () => {
        await WebBrowser.openBrowserAsync(item.url!);
      }, 300);
      return;
    }

    // Handle in-app WebView URL (with caching)
    if (item.webUrl) {
      // Set tab config if specified, otherwise reset to default
      if (item.tabConfig) {
        setTabConfig(item.tabConfig);
      } else {
        resetToDefault();
      }
      setTimeout(() => {
        router.push({
          pathname: '/(tabs)/webview',
          params: {
            url: encodeURIComponent(item.webUrl!),
            title: item.title,
          },
        } as any);
      }, 300);
      return;
    }

    // Handle special actions
    switch (item.action) {
      case 'signout':
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign Out',
            style: 'destructive',
            onPress: () => signOut(),
          },
        ]);
        return;

      case 'settings':
        resetToDefault(); // Settings uses default tabs
        if (item.route) {
          setTimeout(() => router.push(item.route as any), 300);
        }
        return;

      case 'feedback':
        setTimeout(() => openFeedbackModal('general'), 300);
        return;

      case 'help':
        Alert.alert('Help', 'Help documentation coming soon!');
        return;

      default:
        // Set tab config if specified for route navigation
        if (item.tabConfig) {
          setTabConfig(item.tabConfig);
        } else {
          resetToDefault();
        }
        if (item.route) {
          setTimeout(() => router.push(item.route as any), 300);
        }
    }
  };

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 1000 }]} pointerEvents={isOpen ? 'auto' : 'none'}>
      {/* Overlay */}
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer} />
      </Animated.View>

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          drawerStyle,
          {
            width: DRAWER_WIDTH,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            backgroundColor: colors.background,
          },
        ]}
      >
        {/* Header - App Name and Tagline */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.headerContent}>
            <Text style={[styles.appName, { color: colors.primary }]}>{appName}</Text>
            <Text style={[styles.tagline, { color: colors.textSecondary }]}>
              {appIdentity.appTagline}
            </Text>
          </View>
          <TouchableOpacity onPress={closeDrawer} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* User Section - Shows in menu items area */}
        {user && (
          <TouchableOpacity 
            style={[styles.userSection, { borderBottomColor: colors.border }]}
            activeOpacity={0.7}
          >
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
              {user.subtitle && (
                <Text style={[styles.userSubtitle, { color: colors.textSecondary }]}>
                  {user.subtitle}
                </Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}

        {/* Menu Items */}
        <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
          {siteNavigation.map((item) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity
                style={[styles.menuItem, item.action === 'signout' && styles.signOutItem]}
                onPress={() => handleMenuItemPress(item)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={item.icon as keyof typeof Ionicons.glyphMap}
                  size={22}
                  color={item.action === 'signout' ? colors.danger : colors.text}
                  style={styles.menuIcon}
                />
                <Text
                  style={[
                    styles.menuText,
                    { color: item.action === 'signout' ? colors.danger : colors.text },
                  ]}
                >
                  {item.title}
                </Text>
                {item.url && (
                  <Ionicons
                    name="open-outline"
                    size={16}
                    color={colors.textSecondary}
                    style={styles.externalIcon}
                  />
                )}
                {item.webUrl && (
                  <Ionicons
                    name="globe-outline"
                    size={16}
                    color={colors.textSecondary}
                    style={styles.externalIcon}
                  />
                )}
              </TouchableOpacity>
              {item.dividerAfter && (
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              )}
            </React.Fragment>
          ))}
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            {versionString}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    zIndex: 1,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 20,
    zIndex: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flex: 1,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  userInfo: {
    marginLeft: 14,
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '600',
  },
  userSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  signOutItem: {
    marginTop: 8,
  },
  menuIcon: {
    width: 28,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  externalIcon: {
    marginLeft: 8,
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
    marginVertical: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
