import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { ReactNode } from 'react';
import {
    Dimensions,
    Modal as RNModal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeIn,
    FadeOut,
    SlideInDown,
    SlideOutDown,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { animation, layout, overlay, shadows, springs } from '@/config';
import { useTheme } from '@/contexts/ThemeContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export type ModalSize = 'medium' | 'tall';

export interface ModalButton {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export interface AppModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Modal size - 'medium' (60% height) or 'tall' (85% height) */
  size?: ModalSize;
  /** Modal title shown in the header */
  title?: string;
  /** Custom content to render inside the modal */
  children: ReactNode;
  /** Whether to show the close button in the header */
  showCloseButton?: boolean;
  /** Primary action button configuration */
  primaryButton?: ModalButton;
  /** Secondary/cancel button configuration */
  secondaryButton?: ModalButton;
  /** Whether the content is scrollable */
  scrollable?: boolean;
}

/**
 * AppModal - A reusable modal component with blur background
 * 
 * Features:
 * - Blur background overlay
 * - Two sizes: medium (60% screen) and tall (85% screen)
 * - Dynamic content swapping
 * - OK/Cancel buttons as part of internal component
 * - Animated entrance/exit
 * 
 * @example
 * ```tsx
 * <AppModal
 *   visible={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   size="medium"
 *   title="Confirm Action"
 *   primaryButton={{ label: 'OK', onPress: handleConfirm }}
 *   secondaryButton={{ label: 'Cancel', onPress: () => setIsOpen(false) }}
 * >
 *   <Text>Are you sure you want to proceed?</Text>
 * </AppModal>
 * ```
 */
export function AppModal({
  visible,
  onClose,
  size = 'medium',
  title,
  children,
  showCloseButton = true,
  primaryButton,
  secondaryButton,
  scrollable = true,
}: AppModalProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const modalHeight = size === 'tall' ? SCREEN_HEIGHT * 0.85 : SCREEN_HEIGHT * 0.60;

  const getButtonStyle = (variant: ModalButton['variant']) => {
    switch (variant) {
      case 'danger':
        return { backgroundColor: '#EF4444' };
      case 'secondary':
        return { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border };
      case 'primary':
      default:
        return { backgroundColor: colors.primary };
    }
  };

  const getButtonTextStyle = (variant: ModalButton['variant']) => {
    if (variant === 'secondary') {
      return { color: colors.text };
    }
    return { color: '#FFFFFF' };
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Blurred Background Overlay (matches QuickActions style) */}
        <Animated.View 
          entering={FadeIn.duration(animation.normal)} 
          exiting={FadeOut.duration(animation.fast)}
          style={styles.overlay}
        >
          <BlurView intensity={overlay.blurIntensity} tint="dark" style={StyleSheet.absoluteFill}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={onClose}
            />
          </BlurView>
        </Animated.View>

        {/* Modal Content */}
        <Animated.View
          entering={SlideInDown.springify().damping(springs.modal.damping).stiffness(springs.modal.stiffness)}
          exiting={SlideOutDown.duration(animation.modalExit)}
          style={[
            styles.modalContainer,
            {
              height: modalHeight,
              backgroundColor: colors.background,
              paddingBottom: insets.bottom || 20,
            },
          ]}
        >
          {/* Handle Bar */}
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
          </View>

          {/* Header */}
          {(title || showCloseButton) && (
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <View style={styles.headerSpacer} />
              {title && (
                <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
              )}
              {showCloseButton ? (
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              ) : (
                <View style={styles.headerSpacer} />
              )}
            </View>
          )}

          {/* Content */}
          {scrollable ? (
            <ScrollView
              style={styles.contentScroll}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          ) : (
            <View style={[styles.contentScroll, styles.contentContainer]}>
              {children}
            </View>
          )}

          {/* Footer with Buttons */}
          {(primaryButton || secondaryButton) && (
            <View style={[styles.footer, { borderTopColor: colors.border }]}>
              {secondaryButton && (
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.secondaryButton,
                    getButtonStyle(secondaryButton.variant || 'secondary'),
                    secondaryButton.disabled && styles.buttonDisabled,
                  ]}
                  onPress={secondaryButton.onPress}
                  disabled={secondaryButton.disabled}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      getButtonTextStyle(secondaryButton.variant || 'secondary'),
                    ]}
                  >
                    {secondaryButton.label}
                  </Text>
                </TouchableOpacity>
              )}
              {primaryButton && (
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.primaryButton,
                    getButtonStyle(primaryButton.variant || 'primary'),
                    primaryButton.disabled && styles.buttonDisabled,
                  ]}
                  onPress={primaryButton.onPress}
                  disabled={primaryButton.disabled}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      getButtonTextStyle(primaryButton.variant || 'primary'),
                    ]}
                  >
                    {primaryButton.label}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </Animated.View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    borderTopLeftRadius: layout.sheetRadius,
    borderTopRightRadius: layout.sheetRadius,
    ...shadows.sheet,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerSpacer: {
    width: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    borderTopWidth: 1,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {},
  secondaryButton: {},
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

export default AppModal;
