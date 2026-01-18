import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { appFeatures, appIdentity } from '@/config';
import { useDrawer } from '@/contexts/DrawerContext';
import { useThemeColors } from '@/contexts/ThemeContext';

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
  const colors = useThemeColors();
  const features = appFeatures;
  const { appName, appTagline } = appIdentity;

  const handleNotificationPress = () => {
    router.push('/notifications' as any);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      <View style={styles.content}>
        {/* Left Section - Menu or Back Button */}
        <View style={styles.leftSection}>
          {showBackButton ? (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onBackPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={toggleDrawer}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="menu" size={28} color={colors.text} />
            </TouchableOpacity>
          )}

          {/* App Name and Tagline */}
          {!showBackButton && (
            <View style={styles.appInfo}>
              <Text style={[styles.appName, { color: colors.primary }]}>{appName}</Text>
              {appTagline && (
                <Text style={[styles.appTagline, { color: colors.textSecondary }]} numberOfLines={1}>
                  {appTagline}
                </Text>
              )}
            </View>
          )}

          {/* Title for back button screens */}
          {showBackButton && title && (
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          )}
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
                  <Ionicons name="notifications-outline" size={24} color={colors.text} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.iconButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
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
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  appInfo: {
    marginLeft: 12,
    flex: 1,
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  appTagline: {
    fontSize: 11,
    marginTop: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
});
