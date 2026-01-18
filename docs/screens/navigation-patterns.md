# Screen Navigation Patterns

This guide explains how to implement different navigation patterns in the Affordly app, including when to show/hide the bottom tab bar and how to use the standardized `ScreenWrapper` component.

## Navigation Modes

The app uses two primary navigation modes:

### 1. **Standalone Mode** (Full-Screen, No Bottom Tabs)

Used for screens that overlay the main content and hide the bottom tab bar:

- Settings
- Notifications  
- Modal screens
- Add/Edit forms (Add Transaction, Scan Receipt, Add Recurring)
- Detail views
- Drawer menu items (Scenarios, Documents, Activity)

**Characteristics:**
- Custom header with back/close button
- Full-screen overlay (covers bottom tabs)
- Uses `useSafeAreaInsets()` for proper spacing

### 2. **Tabbed Mode** (With Bottom Tabs Visible)

Used for main tab screens where the bottom navigation should remain visible:

- Overview (index)
- Transactions
- Recurring
- Receipts

**Characteristics:**
- Header handled by `AppShell` (hamburger menu, title, notifications)
- Bottom tabs always visible
- Content scrolls within the tab area

---

## Using ScreenWrapper Component

The `ScreenWrapper` component provides a standardized way to create screens with consistent navigation patterns.

### Import

```tsx
import { ScreenWrapper } from '@/components/ui';
```

### Standalone Screen (Recommended for most non-tab screens)

```tsx
export default function MyScreen() {
  return (
    <ScreenWrapper
      title="Screen Title"
      subtitle="Optional subtitle"
      mode="standalone"
      backIcon="close"  // or "back" for arrow
    >
      {/* Your content here */}
    </ScreenWrapper>
  );
}
```

### Tabbed Screen Content

For screens within the tab navigator that need the same header styling:

```tsx
export default function MyTabScreen() {
  return (
    <ScreenWrapper
      title="Tab Screen"
      subtitle="Description here"
      mode="tabbed"
    >
      {/* Your content here */}
    </ScreenWrapper>
  );
}
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Screen title in header |
| `subtitle` | `string` | - | Optional subtitle below title |
| `mode` | `'standalone' \| 'tabbed'` | `'standalone'` | Navigation mode |
| `backIcon` | `'close' \| 'back'` | `'close'` | Back button icon style |
| `rightContent` | `ReactNode` | - | Custom right header content |
| `scrollable` | `boolean` | `true` | Use ScrollView or View |
| `children` | `ReactNode` | required | Screen content |

---

## File Location Determines Behavior

### Routes in `app/` (root level) → Standalone by default

Files directly in the `app/` folder render as full-screen overlays:

```
app/
├── settings.tsx      → Full screen, no tabs
├── notifications.tsx → Full screen, no tabs
├── modal.tsx         → Full screen, no tabs
├── scenarios.tsx     → Full screen, no tabs
├── add-transaction.tsx → Full screen, no tabs
```

### Routes in `app/(tabs)/` → Tabbed by default

Files inside the `(tabs)` folder use the tab layout:

```
app/(tabs)/
├── index.tsx         → Tab screen with bottom nav
├── transactions.tsx  → Tab screen with bottom nav
├── recurring.tsx     → Tab screen with bottom nav
├── receipts.tsx      → Tab screen with bottom nav
```

---

## Creating a New Screen

### Step 1: Determine the navigation mode

| Screen Purpose | Mode | Location |
|---------------|------|----------|
| Main tab content | tabbed | `app/(tabs)/name.tsx` |
| Settings/preferences | standalone | `app/name.tsx` |
| Add/Edit forms | standalone | `app/name.tsx` |
| Detail views | standalone | `app/name.tsx` |
| Drawer menu items | standalone | `app/name.tsx` |
| Modal dialogs | standalone | `app/name.tsx` |

### Step 2: Create the file

**For standalone screens (drawer menu, quick actions, etc.):**

```tsx
// app/my-screen.tsx
import { ScreenWrapper } from '@/components/ui';

export default function MyScreen() {
  return (
    <ScreenWrapper
      title="My Screen"
      subtitle="Description"
      mode="standalone"
      backIcon="back"
    >
      {/* Content */}
    </ScreenWrapper>
  );
}
```

**For tab screens:**

```tsx
// app/(tabs)/my-tab.tsx
import { ScreenWrapper } from '@/components/ui';

export default function MyTabScreen() {
  return (
    <ScreenWrapper
      title="My Tab"
      subtitle="Tab description"
      mode="tabbed"
    >
      {/* Content */}
    </ScreenWrapper>
  );
}
```

### Step 3: Add navigation entry (if needed)

**For drawer menu items** (`config/site.navigation.ts`):
```typescript
{
  id: 'my-screen',
  title: 'My Screen',
  icon: 'document',
  route: '/my-screen',
},
```

**For quick action items** (`config/quickactions.navigation.ts`):
```typescript
{
  id: 'my-action',
  title: 'My Action',
  icon: 'add',
  route: '/my-screen',
},
```

**For tab items** (`config/tabs.navigation.ts`):
```typescript
{
  name: 'my-tab',
  title: 'My Tab',
  icon: 'home',
},
```

---

## Advanced: Custom Header Actions

Add buttons or icons to the header right side:

```tsx
<ScreenWrapper
  title="Edit Item"
  mode="standalone"
  backIcon="close"
  rightContent={
    <TouchableOpacity onPress={handleSave}>
      <Text style={{ color: colors.primary, fontWeight: '600' }}>Save</Text>
    </TouchableOpacity>
  }
>
  {/* Form content */}
</ScreenWrapper>
```

---

## Examples in the Codebase

| Screen | File | Mode | Back Icon |
|--------|------|------|-----------|
| Settings | `app/settings.tsx` | standalone | close |
| Notifications | `app/notifications.tsx` | standalone | close |
| Modal Examples | `app/modal.tsx` | standalone | close |
| What-If Scenarios | `app/scenarios.tsx` | standalone | back |
| My Documents | `app/documents.tsx` | standalone | back |
| Activity Logs | `app/activity.tsx` | standalone | back |
| Add Transaction | `app/add-transaction.tsx` | standalone | close |
| Scan Receipt | `app/scan-receipt.tsx` | standalone | close |
| Add Recurring | `app/add-recurring.tsx` | standalone | close |
| Overview | `app/(tabs)/index.tsx` | tabbed | - |
| Transactions | `app/(tabs)/transactions.tsx` | tabbed | - |
| Recurring | `app/(tabs)/recurring.tsx` | tabbed | - |
| Receipts | `app/(tabs)/receipts.tsx` | tabbed | - |

---

## Best Practices

1. **Use `ScreenWrapper` for consistency** - All new screens should use this component
2. **Use `backIcon="back"` for drill-down navigation** (going deeper into content)
3. **Use `backIcon="close"` for modal-like screens** (forms, overlays, actions)
4. **Always include a subtitle** for better UX and context
5. **Keep standalone screens focused** - They're meant for specific tasks
6. **Tab screens are for browsing** - Main content exploration
