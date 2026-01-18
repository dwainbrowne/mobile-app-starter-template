# Screens Overview

This document provides an overview of all screens in the Affordly App.

---

## Screen Categories

### 1. Tab Screens (Bottom Navigation)
Located in `app/(tabs)/`, these are the main content screens:

| Screen | File | Description |
|--------|------|-------------|
| Overview | `index.tsx` | Main dashboard/home screen |
| Transactions | `transactions.tsx` | List of all transactions |
| Recurring | `recurring.tsx` | Recurring payments/income |
| Receipts | `receipts.tsx` | Receipt management |

### 2. Modal/Standalone Screens
Located in `app/`, these are overlay or full-screen experiences:

| Screen | File | Description |
|--------|------|-------------|
| Login | `login.tsx` | Authentication screen |
| Settings | `settings.tsx` | App settings and preferences |
| Notifications | `notifications.tsx` | Inbox-style notifications |
| Modal | `modal.tsx` | Generic modal screen |

### 3. Hidden Tab Screens
These exist but are not shown in the tab bar:

| Screen | File | Description |
|--------|------|-------------|
| Add | `add.tsx` | Add new item screen |
| Explore | `explore.tsx` | Explore/discover screen |

---

## Screen Details

### Overview Screen (`index.tsx`)

**Purpose:** Main dashboard showing financial overview and quick stats.

**Features:**
- Hero welcome card
- Analytics summary cards (total value, expenses)
- Getting started info section

**Components Used:**
- `ScrollView` for content scrolling
- Theme-aware cards with shadow effects

**Configuration:**
- Configured in `tabs.navigation.ts` as first tab
- Icon: `pie-chart`

---

### Transactions Screen (`transactions.tsx`)

**Purpose:** Display list of all financial transactions.

**Features:**
- Filterable transaction list
- Income/expense type indicators
- Amount formatting with currency
- Date grouping

**Data Structure:**
```typescript
interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}
```

**Configuration:**
- Icon: `swap-horizontal`

---

### Recurring Screen (`recurring.tsx`)

**Purpose:** Manage recurring payments and income.

**Features:**
- List of scheduled transactions
- Frequency display (weekly, monthly, etc.)
- Next payment date
- Type indicators (income/expense)

**Data Structure:**
```typescript
interface RecurringItem {
  id: string;
  title: string;
  amount: number;
  frequency: string;
  nextDate: string;
  type: 'income' | 'expense';
}
```

**Configuration:**
- Icon: `repeat`

---

### Receipts Screen (`receipts.tsx`)

**Purpose:** Store and manage receipt images.

**Features:**
- Receipt cards with merchant info
- Image attachment indicator
- Category tagging
- Add receipt button

**Data Structure:**
```typescript
interface Receipt {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  category: string;
  hasImage: boolean;
}
```

**Configuration:**
- Icon: `document-text`

---

### Login Screen (`login.tsx`)

**Purpose:** User authentication and onboarding.

**Features:**
- Dual auth support (standard/OTP)
- Social login buttons
- Branding display
- Legal links

**Related Files:**
- `components/auth/LoginShell.tsx`
- `components/auth/StandardLoginScreen.tsx`
- `components/auth/OTPLoginScreen.tsx`
- `config/auth.config.ts`

---

### Settings Screen (`settings.tsx`)

**Purpose:** Configure app preferences and user settings.

**Sections:**
1. **Account** - User profile, sign out
2. **Appearance** - Dark mode toggle, theme style selection
3. **Notifications** - Push, email, alert settings
4. **Preferences** - Language, currency, date format
5. **Team** - Team members, workspace settings
6. **Categories** - Expense/income category management
7. **About** - App info, legal links

**Related Contexts:**
- `ThemeContext` - Theme settings
- `SettingsContext` - User preferences
- `FeedbackContext` - Feedback modal

---

### Notifications Screen (`notifications.tsx`)

**Purpose:** Inbox-style notification center.

**Features:**
- Multiple notification types (alert, message, update, video, promo)
- Read/unread states with visual indicators
- Mark all as read functionality
- Video thumbnail previews
- Banner image support

**Notification Types:**
| Type | Icon | Color | Use Case |
|------|------|-------|----------|
| message | mail | primary | General messages |
| alert | warning | warning | Budget alerts, reminders |
| update | sparkles | info | Feature updates |
| video | play-circle | danger | Video content |
| promo | gift | success | Promotions |

**Data Structure:**
```typescript
interface NotificationItem {
  id: string;
  type: 'message' | 'alert' | 'update' | 'video' | 'promo';
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  imageUrl?: string;
  videoThumbnail?: string;
  actionUrl?: string;
}
```

---

## Screen Layout Pattern

All screens follow a consistent pattern:

```tsx
export default function ScreenName() {
  const colors = useThemeColors();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Content */}
    </View>
  );
}
```

### For Scrollable Content:
```tsx
<ScrollView
  style={[styles.container, { backgroundColor: colors.surface }]}
  contentContainerStyle={styles.content}
>
  {/* Content */}
</ScrollView>
```

### For List Content:
```tsx
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  contentContainerStyle={styles.listContent}
/>
```

---

## Adding a New Screen

### As a Tab Screen:
1. Create `app/(tabs)/newscreen.tsx`
2. Add to `config/tabs.navigation.ts`:
```typescript
{
  name: 'newscreen',
  title: 'New Screen',
  icon: 'star',
}
```
3. Register in `app/(tabs)/_layout.tsx`:
```tsx
<Tabs.Screen name="newscreen" />
```

### As a Standalone Screen:
1. Create `app/newscreen.tsx`
2. Navigate with: `router.push('/newscreen')`

### As a Drawer Item:
1. Create screen file
2. Add to `config/site.navigation.ts`:
```typescript
{
  id: 'newscreen',
  title: 'New Screen',
  icon: 'star',
  route: '/newscreen',
}
```

---

## Screen Components

### Common Components Used:
- `Card` / `CardSection` - Content cards
- `FlatList` - List rendering
- `ScrollView` - Scrollable content
- `TouchableOpacity` - Pressable items
- `Ionicons` - Icons

### Theme Integration:
```tsx
const colors = useThemeColors();

// Apply colors
style={{ 
  backgroundColor: colors.surface,
  color: colors.text,
  borderColor: colors.border,
}}
```

---

## Screen Testing Checklist

When adding or modifying screens:

- [ ] Works in light mode
- [ ] Works in dark mode (all styles)
- [ ] Handles empty state
- [ ] Handles loading state
- [ ] Responsive on different screen sizes
- [ ] Safe area insets applied
- [ ] Navigation works correctly
- [ ] Theme colors applied consistently
