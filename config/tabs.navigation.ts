/**
 * TABS NAVIGATION CONFIG
 *
 * Bottom tab bar navigation items.
 * Each tab must have a matching file in app/(tabs)/ folder.
 *
 * Icons: Use Ionicons names - https://ionic.io/ionicons
 */

import type { TabItem } from '@/interfaces';

const tabsNavigation: TabItem[] = [
  {
    name: 'index',
    title: 'Overview',
    icon: 'pie-chart',
  },
  {
    name: 'transactions',
    title: 'Transactions',
    icon: 'swap-horizontal',
  },
  {
    name: 'recurring',
    title: 'Recurring',
    icon: 'repeat',
  },
  {
    name: 'receipts',
    title: 'Receipts',
    icon: 'document-text',
  },
];

export default tabsNavigation;
