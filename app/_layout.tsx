import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { AppShellProvider } from '@/components/app-shell';
import { FeedbackModal } from '@/components/feedback';
import { useAuth } from '@/contexts/AuthContext';
import { FeedbackProvider } from '@/contexts/FeedbackContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

function useProtectedRoute(isAuthenticated: boolean) {
  const segments = useSegments();
  const router = useRouter();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    // Set navigation ready after initial render
    setIsNavigationReady(true);
  }, []);

  useEffect(() => {
    if (!isNavigationReady) return;

    const inAuthGroup = segments[0] === 'login';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if authenticated and on login page
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, isNavigationReady]);
}

function RootLayoutInner() {
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuth();

  useProtectedRoute(isAuthenticated);

  return (
    <NavThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <SettingsProvider>
        <FeedbackProvider>
          <Slot />
          <FeedbackModal />
          <StatusBar style={isDark ? 'light' : 'dark'} />
        </FeedbackProvider>
      </SettingsProvider>
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppShellProvider>
        <RootLayoutInner />
      </AppShellProvider>
    </ThemeProvider>
  );
}
