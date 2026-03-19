import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
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
      translateX.value = withTiming(0, { 
        duration: 300, 
        easing: Easing.out(Easing.cubic) 
      });
      overlayOpacity.value = withTiming(0.5, { 
        duration: 300, 
        easing: Easing.out(Easing.quad) 
      });
    } else {
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
        resetToDefault();
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
            backgroundColor: '#FFFFFF',
          },
        ]}
      >
        {/* Gradient Header */}
        <LinearGradient
          colors={['#7B42F6', '#4A7CF7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 16 }]}
        >
          <View style={styles.headerTop}>
            <View style={styles.headerContent}>
              <Text style={styles.appName}>{appName}</Text>
              <Text style={styles.tagline}>
                {appIdentity.appTagline}
              </Text>
            </View>
            <TouchableOpacity onPress={closeDrawer} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* User Info in Gradient Header */}
          {user && (
            <View style={styles.userSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userSubtitle}>
                  {user.subtitle || '0 open work orders'}
                </Text>
              </View>
            </View>
          )}

          <Text style={styles.versionText}>{versionString}</Text>
        </LinearGradient>

        {/* Menu Items */}
        <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
          {siteNavigation.map((item) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity
                style={[styles.menuItem, item.action === 'signout' && styles.signOutItem]}
                onPress={() => handleMenuItemPress(item)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.menuIconBox,
                  { backgroundColor: item.iconColor || colors.primary },
                  item.action === 'signout' && { backgroundColor: colors.danger },
                ]}>
                  <Ionicons
                    name={item.icon as keyof typeof Ionicons.glyphMap}
                    size={18}
                    color="#FFFFFF"
                  />
                </View>
                <Text
                  style={[
                    styles.menuText,
                    { color: item.action === 'signout' ? colors.danger : '#1F2937' },
                  ]}
                >
                  {item.title}
                </Text>
                {item.url && (
                  <Ionicons
                    name="open-outline"
                    size={16}
                    color="#9CA3AF"
                    style={styles.externalIcon}
                  />
                )}
              </TouchableOpacity>
              {item.dividerAfter && (
                <View style={styles.divider} />
              )}
            </React.Fragment>
          ))}
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          <Text style={styles.footerText}>
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
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerContent: {
    flex: 1,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#FFFFFF',
  },
  tagline: {
    fontSize: 12,
    marginTop: 2,
    color: 'rgba(255,255,255,0.8)',
  },
  closeButton: {
    padding: 4,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  userSubtitle: {
    fontSize: 13,
    marginTop: 2,
    color: 'rgba(255,255,255,0.7)',
  },
  versionText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  menuContainer: {
    flex: 1,
    paddingTop: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  signOutItem: {
    marginTop: 4,
  },
  menuIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 14,
    flex: 1,
  },
  externalIcon: {
    marginLeft: 8,
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
    marginVertical: 8,
    backgroundColor: '#E5E7EB',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
