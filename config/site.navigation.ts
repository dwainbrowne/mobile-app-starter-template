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
 * - dividerAfter: Show a divider line after this item
 *
 * Icons: Use Ionicons names - https://ionic.io/ionicons
 */

import type { DrawerMenuItem } from '@/interfaces';

const siteNavigation: DrawerMenuItem[] = [
  {
    id: 'modal-demo',
    title: 'Modal Examples',
    icon: 'layers',
    route: '/modal',
  },
  {
    id: 'scenarios',
    title: 'What-If Scenarios',
    icon: 'bulb',
    route: '/scenarios',
  },
  {
    id: 'documents',
    title: 'My Documents',
    icon: 'folder',
    route: '/documents',
  },
  {
    id: 'activity',
    title: 'Activity Logs',
    icon: 'time',
    route: '/activity',
  },
  {
    id: 'feedback',
    title: 'Send Feedback',
    icon: 'mail',
    action: 'feedback',
    dividerAfter: true,
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
