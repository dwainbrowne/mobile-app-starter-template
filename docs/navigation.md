# Navigation System

The Affordly App has three main navigation systems, all configuration-driven:

1. **Bottom Tab Bar** - Primary navigation between main screens
2. **Side Drawer** - Secondary navigation and settings
3. **Quick Actions (FAB)** - Floating action button with slide-up menu

---

## 1. Bottom Tab Bar

### Configuration File
`config/tabs.navigation.ts`

### Structure
```typescript
import type { TabItem } from '@/interfaces';

const tabsNavigation: TabItem[] = [
  {
    name: 'index',        // Must match file in app/(tabs)/
    title: 'Overview',    // Display label
    icon: 'pie-chart',    // Ionicons name
  },
  {
    name: 'transactions',
    title: 'Transactions',
    icon: 'swap-horizontal',
  },
  // ... more tabs
];

export default tabsNavigation;
```

### How It Works
1. `CustomTabBar.tsx` reads from `DynamicTabContext`
2. Context loads config from `tabs.navigation.ts`
3. Tab bar renders only configured tabs
4. Each tab must have a matching file in `app/(tabs)/`

### Adding a New Tab
1. Create `app/(tabs)/newtab.tsx`
2. Add to `config/tabs.navigation.ts`:
```typescript
{
  name: 'newtab',
  title: 'New Tab',
  icon: 'star',
}
```
3. Register in `app/(tabs)/_layout.tsx`:
```tsx
<Tabs.Screen name="newtab" />
```

### Hiding a Tab
Add `options={{ href: null }}` in `_layout.tsx`:
```tsx
<Tabs.Screen name="add" options={{ href: null }} />
```

### Tab Icons
Uses [Ionicons](https://ionic.io/ionicons). Common icons:
- `home`, `pie-chart`, `wallet`, `card`
- `document-text`, `receipt`, `folder`
- `settings`, `person`, `notifications`

Filled icons are shown when selected, outline when not.

---

## 2. Side Drawer Navigation

### Configuration File
`config/site.navigation.ts`

### Structure
```typescript
import type { DrawerMenuItem } from '@/interfaces';

const siteNavigation: DrawerMenuItem[] = [
  {
    id: 'scenarios',
    title: 'What-If Scenarios',
    icon: 'bulb',
    route: '/scenarios',      // Internal route
  },
  {
    id: 'help',
    title: 'Help & Instructions',
    icon: 'help-circle',
    url: 'https://help.app',  // External URL
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: 'settings',
    action: 'settings',       // Special action
    route: '/settings',
    dividerAfter: true,       // Visual separator
  },
  {
    id: 'signout',
    title: 'Sign Out',
    icon: 'log-out',
    action: 'signout',        // Sign out action
  },
];
```

### Menu Item Types

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique identifier |
| `title` | string | Display text |
| `icon` | string | Ionicons name |
| `route` | string | Internal app route |
| `url` | string | External HTTP URL |
| `action` | string | Special action handler |
| `dividerAfter` | boolean | Show divider after item |

### Special Actions
- `settings` - Navigate to settings route
- `signout` - Show sign out confirmation
- `feedback` - Open feedback modal
- `help` - Show help info

### Drawer Layout
```
┌─────────────────────────┐
│  App Name               │
│  Tagline                │
├─────────────────────────┤
│  👤 User Name           │
│     user@email.com      │
├─────────────────────────┤
│  📋 Menu Item 1         │
│  📋 Menu Item 2         │
│  ─────────────────────  │
│  📋 Menu Item 3         │
├─────────────────────────┤
│  v1.0.0 Build 1         │
└─────────────────────────┘
```

### Opening the Drawer
```tsx
import { useDrawer } from '@/contexts/DrawerContext';

const { toggleDrawer, openDrawer, closeDrawer, isOpen } = useDrawer();
```

---

## 3. Quick Actions Menu (FAB)

### Configuration File
`config/quickactions.navigation.ts`

### Structure
```typescript
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
    id: 'external-link',
    title: 'Visit Website',
    icon: 'globe',
    url: 'https://affordly.app',
  },
  {
    id: 'quick-note',
    title: 'Quick Note',
    icon: 'create',
    action: 'quick-note',     // Custom action
    color: '#10B981',         // Custom icon color
  },
];
```

### How It Works
1. FAB button positioned in center of tab bar
2. Pressing FAB opens slide-up modal
3. Actions arranged in a grid layout
4. Handles routes, URLs, and custom actions

### Controlling the FAB
```tsx
import { useQuickActions } from '@/contexts/QuickActionsContext';

const { isOpen, toggleQuickActions, closeQuickActions } = useQuickActions();
```

### Disabling the FAB
In `config/app.ts`:
```typescript
export const appFeatures: AppFeatures = {
  showQuickActionButton: false,  // Hides FAB
  // ...
};
```

---

## Dynamic Tab Configuration

The `DynamicTabContext` allows changing tabs at runtime:

```tsx
import { useDynamicTabs } from '@/contexts/DynamicTabContext';

const { currentConfig, setTabConfig, resetToDefault } = useDynamicTabs();

// Change tabs dynamically
setTabConfig({
  tabs: [
    { name: 'index', title: 'Home', icon: 'home' },
    { name: 'custom', title: 'Custom', icon: 'star' },
  ],
  floatingAction: {
    icon: 'add',
    color: '#F97316',
    onPress: () => console.log('Custom action'),
  },
});

// Reset to default config
resetToDefault();
```

---

## Navigation Patterns

### Internal Navigation
```tsx
import { useRouter } from 'expo-router';

const router = useRouter();

// Navigate to route
router.push('/settings');

// Navigate with params
router.push({ pathname: '/details', params: { id: '123' } });

// Go back
router.back();

// Replace (no back history)
router.replace('/login');
```

### External URLs
```tsx
import * as WebBrowser from 'expo-web-browser';

await WebBrowser.openBrowserAsync('https://example.com');
```

### Deep Linking
Expo Router handles deep links automatically based on file structure:
- `app/settings.tsx` → `yourapp://settings`
- `app/(tabs)/transactions.tsx` → `yourapp://transactions`

---

## TypeScript Interfaces

### TabItem
```typescript
interface TabItem {
  name: string;   // Route name
  title: string;  // Display title
  icon: string;   // Ionicons name
}
```

### DrawerMenuItem
```typescript
interface DrawerMenuItem {
  id: string;
  title: string;
  icon: string;
  route?: string;
  url?: string;
  action?: 'settings' | 'signout' | 'feedback' | 'help';
  dividerAfter?: boolean;
}
```

### QuickActionItem
```typescript
interface QuickActionItem {
  id: string;
  title: string;
  icon: string;
  color?: string;
  route?: string;
  url?: string;
  action?: string;
}
```

---

## Best Practices

1. **Keep configs focused** - Each config file has one purpose
2. **Use type imports** - `import type { TabItem } from '@/interfaces'`
3. **Match file names** - Tab `name` must match file in `app/(tabs)/`
4. **Use Ionicons consistently** - Reference https://ionic.io/ionicons
5. **Test navigation** - Verify routes exist before adding to config
