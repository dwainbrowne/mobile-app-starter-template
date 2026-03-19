/**
 * SITE NAVIGATION CONFIG
 *
 * Slide-out drawer menu items (hamburger menu).
 * These match the SnapSuite mobile app navigation sidebar.
 *
 * Options:
 * - route: Internal app route (e.g., "/settings")
 * - url: External HTTP URL (opens in browser)
 * - action: Special action ("settings", "signout", "feedback", "help")
 * - tabConfig: Tab configuration ID
 * - iconColor: Background color for the rounded-square icon
 * - dividerAfter: Show a divider line after this item
 *
 * Icons: Use Ionicons names - https://ionic.io/ionicons
 */

import type { DrawerMenuItem } from '@/interfaces';

const siteNavigation: DrawerMenuItem[] = [
  {
    id: 'home',
    title: 'Home',
    icon: 'home',
    iconColor: '#7B42F6',
    route: '/(tabs)/',
    tabConfig: 'default',
  },
  {
    id: 'new-job',
    title: 'New Job',
    icon: 'add',
    iconColor: '#4A7CF7',
    route: '/(tabs)/webview',
    tabConfig: 'default',
  },
  {
    id: 'open-jobs',
    title: 'Open Jobs',
    icon: 'shield',
    iconColor: '#7B42F6',
    route: '/(tabs)/webview',
    tabConfig: 'default',
  },
  {
    id: 'my-schedule',
    title: 'My Schedule',
    icon: 'calendar',
    iconColor: '#10B981',
    route: '/(tabs)/webview',
    tabConfig: 'default',
  },
  {
    id: 'closed-jobs',
    title: 'Closed Jobs',
    icon: 'folder',
    iconColor: '#F97316',
    route: '/(tabs)/webview',
    tabConfig: 'default',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: 'notifications',
    iconColor: '#6B7280',
    route: '/notifications',
  },
  {
    id: 'search',
    title: 'Search',
    icon: 'search',
    iconColor: '#4A7CF7',
    dividerAfter: true,
  },
  {
    id: 'update',
    title: 'Update',
    icon: 'refresh',
    iconColor: '#4A7CF7',
    action: 'help',
  },
  {
    id: 'feedback',
    title: 'Send Feedback',
    icon: 'mail',
    iconColor: '#7B42F6',
    action: 'feedback',
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: 'settings',
    iconColor: '#6B7280',
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
