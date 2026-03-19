import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthProvider } from '@/contexts/AuthContext';
import { DrawerProvider } from '@/contexts/DrawerContext';
import { DynamicTabProvider } from '@/contexts/DynamicTabContext';
import { HeaderProvider, useHeader } from '@/contexts/HeaderContext';
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
 * - Header with hamburger menu (dynamically hideable via useHeader context)
 * - Slide-out drawer navigation
 * - Quick actions FAB menu
 * - Authentication context
 *
 * The header can be dynamically hidden/shown by any child component
 * (including WebView message handlers) via the useHeader() hook:
 *   const { hideHeader, showHeader, setHeaderTitle } = useHeader();
 */
export function AppShellContent({ children, showHeader = true, headerProps }: AppShellProps) {
  const colors = useThemeColors();
  const { headerVisible, headerTitle } = useHeader();

  const isHeaderShown = showHeader && headerVisible;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isHeaderShown && (
        <Header {...headerProps} title={headerTitle || headerProps?.title} />
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

/**
 * AppShellProvider - Provides context for drawer, auth, dynamic tabs, header, and quick actions
 * This should wrap your entire app in _layout.tsx
 */
export function AppShellProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DrawerProvider>
        <DynamicTabProvider>
          <HeaderProvider>
            <QuickActionsProvider>{children}</QuickActionsProvider>
          </HeaderProvider>
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
