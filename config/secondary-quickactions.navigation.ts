/**
 * SECONDARY QUICK ACTIONS NAVIGATION CONFIG
 *
 * Slide-up menu items for the secondary tab system (Notes/Documents mode).
 * These appear when user taps the "Notes" mic button in the secondary tab bar.
 *
 * Options:
 * - route: Internal app route (e.g., "/add-note")
 * - url: External HTTP URL (opens in browser)
 * - action: Custom action identifier for handling in code
 * - color: Optional custom color for the action icon
 *
 * Icons: Use Ionicons names - https://ionic.io/ionicons
 */

import type { QuickActionItem } from '@/interfaces';

const secondaryQuickActionsNavigation: QuickActionItem[] = [
  {
    id: 'voice-note',
    title: 'Voice Note',
    icon: 'mic',
    color: '#6366F1',
    action: 'voice-note',
  },
  {
    id: 'text-note',
    title: 'Text Note',
    icon: 'document-text',
    color: '#10B981',
    action: 'text-note',
  },
  {
    id: 'sketch',
    title: 'Sketch',
    icon: 'brush',
    color: '#F59E0B',
    action: 'sketch',
  },
  {
    id: 'attach-file',
    title: 'Attach File',
    icon: 'attach',
    color: '#3B82F6',
    action: 'attach-file',
  },
];

export default secondaryQuickActionsNavigation;
