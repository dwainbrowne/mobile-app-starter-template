import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

import { secondaryQuickActionsNavigation } from '@/config';
import type { QuickActionItem, TabItem } from '@/interfaces';

/**
 * DYNAMIC TAB NAVIGATION SYSTEM
 *
 * This context allows you to change the bottom tab bar configuration
 * based on the current screen or app state.
 *
 * USAGE EXAMPLES:
 *
 * 1. Change tabs when entering a detail screen:
 *
 *    import { useScreenTabs } from '@/contexts/DynamicTabContext';
 *
 *    function TransactionDetailScreen() {
 *      // Automatically switches to 'transactionDetail' tabs on mount
 *      // and resets to 'default' on unmount
 *      useScreenTabs('transactionDetail', () => {
 *        // Custom floating action button handler
 *        shareTransaction();
 *      });
 *
 *      return <View>...</View>;
 *    }
 *
 * 2. Manually change tabs:
 *
 *    import { useDynamicTabs } from '@/contexts/DynamicTabContext';
 *
 *    function SomeComponent() {
 *      const { setTabConfig, resetToDefault } = useDynamicTabs();
 *
 *      // Switch to document mode
 *      const enterDocumentMode = () => setTabConfig('documents');
 *
 *      // Go back to default
 *      const exitMode = () => resetToDefault();
 *    }
 *
 * 3. Create a custom tab configuration:
 *
 *    const { setCustomConfig } = useDynamicTabs();
 *
 *    setCustomConfig({
 *      id: 'myCustomTabs',
 *      tabs: [
 *        { name: 'index', title: 'Home', icon: 'home' },
 *        { name: 'receipts', title: 'Done', icon: 'checkmark' },
 *      ],
 *      floatingAction: {
 *        icon: 'save',
 *        label: 'Save',
 *        color: '#10B981',
 *      },
 *    });
 */

/**
 * Tab Configuration - defines what tabs are shown and the floating action button
 */
export interface TabConfig {
  /** Unique identifier for this tab configuration */
  id: string;
  /** Tab items to display */
  tabs: TabItem[];
  /** Floating action button configuration (center button) */
  floatingAction?: {
    icon: string;
    label?: string;
    onPress?: () => void;
    color?: string;
  };
  /** Quick action menu items specific to this tab config (overrides default quick actions) */
  quickActions?: QuickActionItem[];
}

/**
 * Predefined tab configurations for different contexts
 */
export const TAB_CONFIGS: Record<string, TabConfig> = {
  // Default/Home tab configuration
  default: {
    id: 'default',
    tabs: [
      { name: 'index', title: 'Overview', icon: 'pie-chart' },
      { name: 'transactions', title: 'Transactions', icon: 'swap-horizontal' },
      { name: 'recurring', title: 'Recurring', icon: 'repeat' },
      { name: 'receipts', title: 'Receipts', icon: 'document-text' },
    ],
    floatingAction: {
      icon: 'add',
      label: 'Add',
    },
  },

  // Example: Transaction detail tab configuration
  transactionDetail: {
    id: 'transactionDetail',
    tabs: [
      { name: 'index', title: 'Back', icon: 'arrow-back' },
      { name: 'transactions', title: 'Edit', icon: 'create' },
      { name: 'receipts', title: 'Attach', icon: 'attach' },
    ],
    floatingAction: {
      icon: 'share-outline',
      label: 'Share',
    },
  },

  // Example: Receipt capture mode
  receiptCapture: {
    id: 'receiptCapture',
    tabs: [
      { name: 'index', title: 'Gallery', icon: 'images' },
      { name: 'receipts', title: 'Files', icon: 'folder' },
    ],
    floatingAction: {
      icon: 'camera',
      label: 'Capture',
      color: '#10B981', // Green for capture
    },
  },

  // Example: Notes/Documents mode (like your screenshot)
  documents: {
    id: 'documents',
    tabs: [
      { name: 'index', title: 'Add Photos', icon: 'camera' },
      { name: 'recurring', title: 'Notes', icon: 'document-text' },
      { name: 'receipts', title: 'Signature', icon: 'create' },
    ],
    floatingAction: {
      icon: 'mic',
      label: 'Record',
      color: '#6366F1',
    },
  },

  // Secondary tab system - for drawer menu items that need different tabs
  secondary: {
    id: 'secondary',
    tabs: [
      { name: 'documents', title: 'Add Photos', icon: 'camera' },
      { name: 'scenarios', title: 'Signature', icon: 'create' },
    ],
    floatingAction: {
      icon: 'mic',
      label: 'Notes',
      color: '#6366F1',
    },
    // Custom quick actions imported from config/secondary-quickactions.navigation.ts
    quickActions: secondaryQuickActionsNavigation,
  },

  // Tools/utilities tab configuration
  tools: {
    id: 'tools',
    tabs: [
      { name: 'modal', title: 'Components', icon: 'layers' },
      { name: 'explore', title: 'Explore', icon: 'compass' },
    ],
    floatingAction: {
      icon: 'code',
      label: 'Demo',
      color: '#10B981',
    },
  },
};

interface DynamicTabContextType {
  /** Current active tab configuration */
  currentConfig: TabConfig;
  /** Set a new tab configuration by ID */
  setTabConfig: (configId: string) => void;
  /** Set a custom tab configuration */
  setCustomConfig: (config: TabConfig) => void;
  /** Reset to default configuration */
  resetToDefault: () => void;
  /** Override the floating action button handler */
  setFloatingActionHandler: (handler: () => void) => void;
  /** Current floating action handler */
  floatingActionHandler: (() => void) | null;
}

const DynamicTabContext = createContext<DynamicTabContextType | undefined>(undefined);

interface DynamicTabProviderProps {
  children: ReactNode;
  /** Initial tab configuration ID */
  initialConfig?: string;
}

export function DynamicTabProvider({ children, initialConfig = 'default' }: DynamicTabProviderProps) {
  const [currentConfig, setCurrentConfig] = useState<TabConfig>(
    TAB_CONFIGS[initialConfig] || TAB_CONFIGS.default
  );
  const [floatingActionHandler, setFloatingActionHandlerState] = useState<(() => void) | null>(null);

  const setTabConfig = useCallback((configId: string) => {
    const config = TAB_CONFIGS[configId];
    if (config) {
      setCurrentConfig(config);
    } else {
      console.warn(`Tab config "${configId}" not found, using default`);
      setCurrentConfig(TAB_CONFIGS.default);
    }
  }, []);

  const setCustomConfig = useCallback((config: TabConfig) => {
    setCurrentConfig(config);
  }, []);

  const resetToDefault = useCallback(() => {
    setCurrentConfig(TAB_CONFIGS.default);
    setFloatingActionHandlerState(null);
  }, []);

  const setFloatingActionHandler = useCallback((handler: () => void) => {
    setFloatingActionHandlerState(() => handler);
  }, []);

  return (
    <DynamicTabContext.Provider
      value={{
        currentConfig,
        setTabConfig,
        setCustomConfig,
        resetToDefault,
        setFloatingActionHandler,
        floatingActionHandler,
      }}
    >
      {children}
    </DynamicTabContext.Provider>
  );
}

export function useDynamicTabs() {
  const context = useContext(DynamicTabContext);
  if (context === undefined) {
    throw new Error('useDynamicTabs must be used within a DynamicTabProvider');
  }
  return context;
}

/**
 * Hook to set tab configuration when a screen mounts
 * Automatically resets to default when unmounting
 *
 * @example
 * // In a detail screen component:
 * useScreenTabs('transactionDetail', () => {
 *   // Custom floating action handler
 *   shareTransaction();
 * });
 */
export function useScreenTabs(configId: string, floatingActionHandler?: () => void) {
  const { setTabConfig, resetToDefault, setFloatingActionHandler } = useDynamicTabs();

  React.useEffect(() => {
    setTabConfig(configId);

    if (floatingActionHandler) {
      setFloatingActionHandler(floatingActionHandler);
    }

    return () => {
      resetToDefault();
    };
  }, [configId, floatingActionHandler, setTabConfig, resetToDefault, setFloatingActionHandler]);
}
