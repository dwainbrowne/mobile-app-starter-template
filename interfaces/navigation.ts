/**
 * Navigation Interfaces
 *
 * Shared interfaces for all navigation configurations.
 */

/**
 * Tab item for bottom navigation bar
 */
export interface TabItem {
  name: string; // Route name (must match file in app/(tabs)/)
  title: string; // Display title
  icon: string; // Icon name (Ionicons)
}

/**
 * Drawer menu item for slide-out side menu
 */
export interface DrawerMenuItem {
  id: string;
  title: string;
  icon: string; // Icon name (Ionicons)
  route?: string; // Internal route to navigate to
  url?: string; // External HTTP URL to open
  action?: 'settings' | 'signout' | 'feedback' | 'help'; // Special actions
  dividerAfter?: boolean; // Show divider after this item
}

/**
 * Quick action item for slide-up FAB menu
 */
export interface QuickActionItem {
  id: string;
  title: string;
  icon: string; // Icon name (Ionicons)
  color?: string; // Optional custom color for this action
  route?: string; // Internal route to navigate to
  url?: string; // External HTTP URL to open
  action?: string; // Custom action identifier
}
