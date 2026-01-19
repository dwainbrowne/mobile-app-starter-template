import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { animation, appFeatures, layout, overlay, quickActionsNavigation, shadows, spacing, springs } from '@/config';
import { useDynamicTabs } from '@/contexts/DynamicTabContext';
import { useQuickActions } from '@/contexts/QuickActionsContext';
import { useThemeColors } from '@/contexts/ThemeContext';
import type { QuickActionItem } from '@/interfaces';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function QuickActionsMenu() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isOpen, closeQuickActions } = useQuickActions();
  const { currentConfig } = useDynamicTabs();
  const colors = useThemeColors();
  const features = appFeatures;

  // Use tab-specific quick actions if defined, otherwise use global quick actions
  const actionsToShow = currentConfig.quickActions || quickActionsNavigation;
  const menuTitle = currentConfig.quickActions
    ? (currentConfig.floatingAction?.label || 'Actions')
    : 'Quick Actions';

  const overlayOpacity = useSharedValue(0);
  const menuTranslateY = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    if (isOpen) {
      overlayOpacity.value = withTiming(1, { duration: animation.normal });
      menuTranslateY.value = withSpring(0, springs.modal);
    } else {
      overlayOpacity.value = withTiming(0, { duration: animation.fast });
      menuTranslateY.value = withTiming(SCREEN_HEIGHT, { duration: animation.normal });
    }
  }, [isOpen, overlayOpacity, menuTranslateY]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const menuStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: menuTranslateY.value }],
  }));

  const handleActionPress = async (item: QuickActionItem) => {
    if (features.hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    closeQuickActions();

    // Small delay to let animation complete
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Handle external URL
    if (item.url) {
      await WebBrowser.openBrowserAsync(item.url);
      return;
    }

    // Handle internal route
    if (item.route) {
      router.push(item.route as any);
      return;
    }

    // Handle custom action
    if (item.action) {
      Alert.alert(item.title, `Action "${item.action}" triggered`);
    }
  };

  if (!features.showQuickActionButton) {
    return null;
  }

  return (
    <Modal visible={isOpen} transparent animationType="none" onRequestClose={closeQuickActions}>
      <View style={styles.modalContainer}>
        {/* Blurred Overlay */}
        <Animated.View style={[styles.overlay, overlayStyle]}>
          <BlurView intensity={overlay.blurIntensity} tint="dark" style={StyleSheet.absoluteFill}>
            <Pressable style={StyleSheet.absoluteFill} onPress={closeQuickActions} />
          </BlurView>
        </Animated.View>

        {/* Bottom Sheet Menu */}
        <Animated.View
          style={[
            styles.menuContainer,
            menuStyle,
            {
              paddingBottom: insets.bottom + 20,
              backgroundColor: colors.background,
            },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <Text style={[styles.menuTitle, { color: colors.text }]}>{menuTitle}</Text>

          <View style={styles.actionsGrid}>
            {actionsToShow.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.actionItem}
                onPress={() => handleActionPress(item)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.actionIcon,
                    { backgroundColor: (item.color || colors.primary) + '15' },
                  ]}
                >
                  <Ionicons
                    name={item.icon as keyof typeof Ionicons.glyphMap}
                    size={24}
                    color={item.color || colors.primary}
                  />
                </View>
                <Text style={[styles.actionTitle, { color: colors.text }]} numberOfLines={2}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Cancel Button */}
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: colors.border }]}
            onPress={closeQuickActions}
            activeOpacity={0.7}
          >
            <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  menuContainer: {
    borderTopLeftRadius: layout.sheetRadius,
    borderTopRightRadius: layout.sheetRadius,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    ...shadows.sheet,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  actionItem: {
    width: '28%',
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  cancelButton: {
    paddingVertical: 14,
    borderTopWidth: 1,
    marginTop: spacing.sm,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
