import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const snapSuiteLogo = require('@/assets/images/snapsuite-logo-white.png');

import { appFeatures } from '@/config';
import { useDrawer } from '@/contexts/DrawerContext';

interface HeaderProps {
  showBackButton?: boolean;
  onBackPress?: () => void;
  title?: string;
  rightComponent?: React.ReactNode;
}

export default function Header({
  showBackButton = false,
  onBackPress,
  title,
  rightComponent,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { toggleDrawer } = useDrawer();
  const features = appFeatures;

  const handleNotificationPress = () => {
    router.push('/notifications' as any);
  };

  return (
    <LinearGradient
      colors={['#9333EA', '#3B82F6']}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.content}>
        {/* Left Section - Menu or Back Button */}
        <View style={styles.leftSection}>
          {showBackButton ? (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onBackPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={toggleDrawer}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="menu" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Center Section - Logo */}
        <View style={styles.centerSection}>
          <Image source={snapSuiteLogo} style={styles.headerLogo} resizeMode="contain" />
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {rightComponent || (
            <>
              {features.showNotificationBell && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleNotificationPress}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.iconButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="ellipsis-vertical" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {},
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 48,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 48,
    justifyContent: 'flex-end',
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  headerLogo: {
    width: 140,
    height: 28,
  },
});
