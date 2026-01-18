import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { appFeatures } from '@/config';
import { useDynamicTabs } from '@/contexts/DynamicTabContext';
import { useQuickActions } from '@/contexts/QuickActionsContext';
import { useThemeColors } from '@/contexts/ThemeContext';

const getIcon = (iconName: string, focused: boolean): keyof typeof Ionicons.glyphMap => {
  const outlineIcons = [
    'pie-chart',
    'document-text',
    'home',
    'send',
    'person',
    'card',
    'wallet',
    'camera',
    'images',
    'folder',
    'create',
    'mic',
  ];
  if (!focused && outlineIcons.includes(iconName)) {
    return `${iconName}-outline` as keyof typeof Ionicons.glyphMap;
  }
  return iconName as keyof typeof Ionicons.glyphMap;
};

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const features = appFeatures;
  const { currentConfig, floatingActionHandler } = useDynamicTabs();
  const { toggleQuickActions } = useQuickActions();

  const handleFloatingPress = () => {
    if (features.hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Use custom handler if provided, otherwise default to quick actions
    if (floatingActionHandler) {
      floatingActionHandler();
    } else if (currentConfig.floatingAction?.onPress) {
      currentConfig.floatingAction.onPress();
    } else {
      toggleQuickActions();
    }
  };

  const handleTabPress = (routeName: string, isFocused: boolean) => {
    if (features.hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const event = navigation.emit({
      type: 'tabPress',
      target: routeName,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  // Filter routes to only show configured tabs
  const visibleRoutes = state.routes.filter((route) =>
    currentConfig.tabs.some((tab) => tab.name === route.name)
  );

  // Calculate positions for tabs around the floating button
  const showFloatingButton = features.showQuickActionButton && currentConfig.floatingAction;
  const middleIndex = Math.ceil(visibleRoutes.length / 2);
  const leftTabs = visibleRoutes.slice(0, middleIndex);
  const rightTabs = visibleRoutes.slice(middleIndex);

  const floatingButtonColor = currentConfig.floatingAction?.color || colors.primary;

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom, backgroundColor: colors.background }]}>
      {/* Floating Action Button - positioned above the tab bar */}
      {showFloatingButton && (
        <TouchableOpacity
          style={[styles.floatingButton, { backgroundColor: floatingButtonColor }]}
          onPress={handleFloatingPress}
          activeOpacity={0.85}
        >
          <Ionicons
            name={currentConfig.floatingAction!.icon as keyof typeof Ionicons.glyphMap}
            size={28}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      )}

      {/* Tab Bar Background */}
      <View style={[styles.tabBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        {/* Left tabs */}
        <View style={styles.tabGroup}>
          {leftTabs.map((route) => {
            const tabConfig = currentConfig.tabs.find((t) => t.name === route.name);
            const isFocused = state.routes[state.index]?.name === route.name;

            if (!tabConfig) return null;

            return (
              <TouchableOpacity
                key={route.key}
                style={styles.tabItem}
                onPress={() => handleTabPress(route.name, isFocused)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={getIcon(tabConfig.icon, isFocused)}
                  size={22}
                  color={isFocused ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isFocused ? colors.primary : colors.textSecondary },
                  ]}
                  numberOfLines={1}
                >
                  {tabConfig.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Center spacer for floating button */}
        {showFloatingButton && <View style={styles.centerSpacer} />}

        {/* Right tabs */}
        <View style={styles.tabGroup}>
          {rightTabs.map((route) => {
            const tabConfig = currentConfig.tabs.find((t) => t.name === route.name);
            const isFocused = state.routes[state.index]?.name === route.name;

            if (!tabConfig) return null;

            return (
              <TouchableOpacity
                key={route.key}
                style={styles.tabItem}
                onPress={() => handleTabPress(route.name, isFocused)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={getIcon(tabConfig.icon, isFocused)}
                  size={22}
                  color={isFocused ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isFocused ? colors.primary : colors.textSecondary },
                  ]}
                  numberOfLines={1}
                >
                  {tabConfig.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 4 : 8,
    paddingHorizontal: 8,
  },
  tabGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minWidth: 60,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
  },
  centerSpacer: {
    width: 70,
  },
  floatingButton: {
    position: 'absolute',
    top: -28,
    left: '50%',
    marginLeft: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
