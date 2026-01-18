/**
 * QUICK ACTIONS NAVIGATION CONFIG
 *
 * Slide-up menu items (floating action button menu).
 * These appear when user taps the "+" button in the bottom tab bar.
 *
 * Options:
 * - route: Internal app route (e.g., "/add-transaction")
 * - url: External HTTP URL (opens in browser)
 * - action: Custom action identifier for handling in code
 * - color: Optional custom color for the action icon
 *
 * Icons: Use Ionicons names - https://ionic.io/ionicons
 */

import type { QuickActionItem } from '@/interfaces';

const quickActionsNavigation: QuickActionItem[] = [
  {
    id: 'add-transaction',
    title: 'Add Transaction',
    icon: 'card',
    route: '/add-transaction',
  },
  {
    id: 'scan-receipt',
    title: 'Scan Receipt',
    icon: 'camera',
    route: '/scan-receipt',
  },
  {
    id: 'add-recurring',
    title: 'Add Recurring',
    icon: 'repeat',
    route: '/add-recurring',
  },
  {
    id: 'quick-note',
    title: 'Quick Note',
    icon: 'create',
    action: 'quick-note',
  },
  {
    id: 'external-link',
    title: 'Visit Website',
    icon: 'globe',
    url: 'https://example.com',
  },
];

export default quickActionsNavigation;
