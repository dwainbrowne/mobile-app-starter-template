/**
 * SITE NAVIGATION CONFIG
 *
 * Slide-out drawer menu items (hamburger menu).
 * These appear when user taps the menu icon in the header.
 *
 * Options:
 * - route: Internal app route (e.g., "/settings")
 * - url: External HTTP URL (opens in browser)
 * - action: Special action ("settings", "signout", "feedback", "help")
 * - tabConfig: Tab configuration ID (e.g., 'default', 'secondary', 'tools')
 *   - 'default': Primary tabs (Overview, Transactions, Recurring, Receipts)
 *   - 'secondary': Secondary tabs (Documents, Scenarios, Activity)
 *   - 'tools': Developer/demo tabs (Components, Explore)
 * - dividerAfter: Show a divider line after this item
 *
 * Icons: Use Ionicons names - https://ionic.io/ionicons
 */

import type { DrawerMenuItem } from '@/interfaces';

const siteNavigation: DrawerMenuItem[] = [
  // Primary navigation - uses default tabs
  {
    id: 'home',
    title: 'Home',
    icon: 'home',
    route: '/(tabs)/',
    tabConfig: 'default', // Explicitly uses default/primary tabs
    dividerAfter: true,
  },
  // Tools/Demo section
  {
    id: 'modal-demo',
    title: 'Modal Examples',
    icon: 'layers',
    route: '/(tabs)/modal',
    tabConfig: 'tools', // Uses tools/demo tab configuration
  },
  // Secondary tab system section
  {
    id: 'scenarios',
    title: 'What-If Scenarios',
    icon: 'bulb',
    route: '/(tabs)/scenarios',
    tabConfig: 'secondary', // Uses secondary tab system (Documents, Scenarios, Activity)
  },
  {
    id: 'documents',
    title: 'My Documents',
    icon: 'folder',
    route: '/(tabs)/documents',
    tabConfig: 'secondary', // Uses secondary tab system
  },
  {
    id: 'activity',
    title: 'Activity Logs',
    icon: 'time',
    route: '/(tabs)/activity',
    tabConfig: 'secondary', // Uses secondary tab system
    dividerAfter: true,
  },
  // Web Pages (in-app WebView with caching)
  {
    id: 'web-affordly',
    title: 'Affordly',
    icon: 'wallet',
    webUrl: 'https://affordly.app/',
  },
  {
    id: 'web-affordly-login',
    title: 'Affordly Login',
    icon: 'log-in',
    webUrl: 'https://m.affordly.app/#/login',
  },
  {
    id: 'web-snapsuite',
    title: 'SnapSuite Features',
    icon: 'sparkles',
    webUrl: 'https://www.snapsuite.io/features',
    dividerAfter: true,
  },
  {
    id: 'feedback',
    title: 'Send Feedback',
    icon: 'mail',
    action: 'feedback',
  },
  {
    id: 'help',
    title: 'Help & Instructions',
    icon: 'help-circle',
    url: 'https://example.com/help',
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: 'settings',
    action: 'settings',
    route: '/settings',
    dividerAfter: true,
  },
  {
    id: 'signout',
    title: 'Sign Out',
    icon: 'log-out',
    action: 'signout',
  },
];

export default siteNavigation;
