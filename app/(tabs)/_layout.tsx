import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppShellContent, CustomTabBar, Drawer, QuickActionsMenu } from '@/components/app-shell';

export default function TabLayout() {
  return (
    <View style={styles.container}>
      {/* Drawer overlay - highest z-index */}
      <Drawer />

      {/* Main content with tabs */}
      <View style={styles.mainContent}>
        <AppShellContent>
          <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
              headerShown: false,
            }}
          >
            {/* All tab screens - visibility controlled by DynamicTabContext */}
            <Tabs.Screen name="index" />
            <Tabs.Screen name="transactions" />
            <Tabs.Screen name="recurring" />
            <Tabs.Screen name="receipts" />

            {/* Hidden screens */}
            <Tabs.Screen name="add" options={{ href: null }} />
            <Tabs.Screen name="explore" options={{ href: null }} />
          </Tabs>
        </AppShellContent>
      </View>

      {/* QuickActionsMenu modal */}
      <QuickActionsMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
});
