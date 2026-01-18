import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthProvider } from '@/contexts/AuthContext';
import { DrawerProvider } from '@/contexts/DrawerContext';
import { DynamicTabProvider } from '@/contexts/DynamicTabContext';
import { QuickActionsProvider } from '@/contexts/QuickActionsContext';
import { useThemeColors } from '@/contexts/ThemeContext';
import Header from './Header';

interface AppShellProps {
  children: ReactNode;
  showHeader?: boolean;
  headerProps?: {
    showBackButton?: boolean;
    onBackPress?: () => void;
    title?: string;
    rightComponent?: ReactNode;
  };
}

/**
 * AppShell - The main wrapper component for the app
 *
 * Provides:
 * - Header with hamburger menu
 * - Slide-out drawer navigation
 * - Quick actions FAB menu
 * - Authentication context
 *
 * Usage:
 * Wrap your main content with <AppShell> to get the full shell experience.
 * The header and drawer are automatically included.
 */
export function AppShellContent({ children, showHeader = true, headerProps }: AppShellProps) {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {showHeader && <Header {...headerProps} />}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

/**
 * AppShellProvider - Provides context for drawer, auth, dynamic tabs, and quick actions
 * This should wrap your entire app in _layout.tsx
 */
export function AppShellProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DrawerProvider>
        <DynamicTabProvider>
          <QuickActionsProvider>{children}</QuickActionsProvider>
        </DynamicTabProvider>
      </DrawerProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
