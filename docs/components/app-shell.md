# App Shell Components

The App Shell provides the main application structure including header, drawer navigation, tab bar, and quick actions menu.

---

## Component Overview

```
components/app-shell/
├── AppShell.tsx           # Provider wrapper + content wrapper
├── Header.tsx             # Top navigation bar
├── Drawer.tsx             # Side navigation menu
├── CustomTabBar.tsx       # Bottom tab navigation
├── QuickActionsMenu.tsx   # FAB slide-up menu
└── index.ts               # Barrel export
```

---

## AppShell

The main shell consists of two parts:

### AppShellProvider
Wraps the entire app with required contexts:
- `AuthProvider` - User authentication
- `DrawerProvider` - Drawer state
- `DynamicTabProvider` - Tab configuration
- `QuickActionsProvider` - FAB menu state

```tsx
// app/_layout.tsx
import { AppShellProvider } from '@/components/app-shell';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppShellProvider>
        {/* App content */}
      </AppShellProvider>
    </ThemeProvider>
  );
}
```

### AppShellContent
Renders header and wraps screen content:

```tsx
// app/(tabs)/_layout.tsx
import { AppShellContent } from '@/components/app-shell';

<AppShellContent>
  <Tabs>
    {/* Tab screens */}
  </Tabs>
</AppShellContent>
```

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | required | Screen content |
| `showHeader` | boolean | true | Show/hide header |
| `headerProps` | object | - | Props passed to Header |

---

## Header

Top navigation bar with menu button, app branding, and action buttons.

### Layout
```
┌─────────────────────────────────────────────────┐
│  ☰  Mobile Starter                🔔  ⋮        │
│     Your app, your way                       │
└─────────────────────────────────────────────────┘
```

### Features
- Hamburger menu button (opens drawer)
- App name and tagline display
- Notification bell (navigates to notifications)
- More options button
- Back button mode for sub-screens

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showBackButton` | boolean | false | Show back arrow instead of menu |
| `onBackPress` | function | - | Custom back handler |
| `title` | string | - | Title when showing back button |
| `rightComponent` | ReactNode | - | Custom right section |

### Usage

**Default (menu mode):**
```tsx
<Header />
```

**Back button mode:**
```tsx
<Header 
  showBackButton 
  title="Settings" 
  onBackPress={() => router.back()} 
/>
```

**Custom right component:**
```tsx
<Header 
  rightComponent={
    <TouchableOpacity>
      <Ionicons name="search" />
    </TouchableOpacity>
  } 
/>
```

### Configuration
Features controlled by `config/app.ts`:
```typescript
export const appFeatures = {
  showNotificationBell: true,  // Show/hide notification icon
  // ...
};
```

---

## Drawer

Slide-out side navigation menu.

### Layout
```
┌─────────────────────────┐
│  Mobile Starter      ✕   │
│  Your app...            │
├─────────────────────────┤
│  👤 John Doe            │
│     john@email.com   >  │
├─────────────────────────┤
│  💡 What-If Scenarios   │
│  📁 My Documents        │
│  ⏱️ Activity Logs       │
│  ─────────────────────  │
│  ⚙️ Settings            │
│  ─────────────────────  │
│  🚪 Sign Out            │
├─────────────────────────┤
│      v1.0.0 Build 1     │
└─────────────────────────┘
```

### Features
- App name and tagline at top
- User profile section (clickable)
- Configurable menu items
- External URL support (opens in browser)
- Special actions (settings, signout, feedback)
- Dividers between sections
- Version info footer
- Animated slide-in/out
- Overlay backdrop

### Configuration
Menu items defined in `config/site.navigation.ts`:
```typescript
const siteNavigation: DrawerMenuItem[] = [
  {
    id: 'scenarios',
    title: 'What-If Scenarios',
    icon: 'bulb',
    route: '/scenarios',
  },
  // ...
];
```

### Control Methods
```tsx
import { useDrawer } from '@/contexts/DrawerContext';

const { isOpen, openDrawer, closeDrawer, toggleDrawer } = useDrawer();
```

---

## CustomTabBar

Dynamic bottom tab navigation bar.

### Layout
```
┌─────────────────────────────────────────────┐
│                                             │
│                    ╭───╮                    │
│                    │ + │                    │
│                    ╰───╯                    │
├──────────┬──────────┬──────────┬───────────┤
│  📊      │  💱      │  🔄      │   📄      │
│ Overview │ Trans... │ Recur... │ Receipts  │
└──────────┴──────────┴──────────┴───────────┘
```

### Features
- Dynamic tabs from configuration
- Floating action button (FAB) in center
- Haptic feedback on press
- Icon filled/outline states
- Safe area padding

### How It Works
1. Reads tab config from `DynamicTabContext`
2. Splits tabs around center FAB
3. Only renders configured tabs
4. Handles navigation on press

### Configuration
Tabs defined in `config/tabs.navigation.ts`:
```typescript
const tabsNavigation: TabItem[] = [
  { name: 'index', title: 'Overview', icon: 'pie-chart' },
  // ...
];
```

FAB controlled by:
```typescript
// config/app.ts
appFeatures.showQuickActionButton = true;
```

### Dynamic Tab Changes
```tsx
import { useDynamicTabs } from '@/contexts/DynamicTabContext';

const { setTabConfig, resetToDefault } = useDynamicTabs();

// Change tabs at runtime
setTabConfig({
  tabs: [/* new tabs */],
  floatingAction: {
    icon: 'camera',
    color: '#10B981',
    onPress: () => { /* custom action */ },
  },
});
```

---

## QuickActionsMenu

Slide-up menu triggered by the FAB.

### Layout
```
┌─────────────────────────────────────┐
│            ─────                    │
│         Quick Actions               │
│                                     │
│  💳 Add        📷 Scan              │
│  Transaction   Receipt              │
│                                     │
│  🔄 Add        ✏️ Quick             │
│  Recurring     Note                 │
│                                     │
│  🌐 Visit                           │
│  Website                            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │          Cancel              │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Features
- Grid layout of action buttons
- Custom icon colors per action
- Internal routes, external URLs, custom actions
- Animated slide-up with spring effect
- Backdrop overlay

### Configuration
Actions defined in `config/quickactions.navigation.ts`:
```typescript
const quickActionsNavigation: QuickActionItem[] = [
  {
    id: 'add-transaction',
    title: 'Add Transaction',
    icon: 'card',
    route: '/add-transaction',
  },
  {
    id: 'quick-note',
    title: 'Quick Note',
    icon: 'create',
    action: 'quick-note',
    color: '#10B981',  // Custom color
  },
  // ...
];
```

### Control Methods
```tsx
import { useQuickActions } from '@/contexts/QuickActionsContext';

const { isOpen, toggleQuickActions, closeQuickActions } = useQuickActions();
```

---

## Import Pattern

Use barrel import from index:
```tsx
import { 
  AppShellContent, 
  AppShellProvider, 
  CustomTabBar, 
  Drawer, 
  Header,
  QuickActionsMenu,
} from '@/components/app-shell';
```

---

## Styling Notes

All components use:
- Theme colors via `useThemeColors()`
- Safe area insets via `useSafeAreaInsets()`
- React Native Reanimated for animations
- Haptic feedback via `expo-haptics`
- Consistent border, shadow, and spacing patterns

---

## Customization

### Change Header Layout
Modify `Header.tsx` directly for structural changes.

### Change Drawer Width
In `Drawer.tsx`:
```typescript
const DRAWER_WIDTH = 300;  // Adjust as needed
```

### Change FAB Position/Style
In `CustomTabBar.tsx`, modify `styles.floatingButton`.

### Change Animation Timing
Adjust timing values in component `useEffect` hooks:
```typescript
translateX.value = withTiming(0, { duration: 250 });  // Drawer
menuTranslateY.value = withSpring(0, { damping: 25 }); // Quick actions
```
