# Context Overview

The Affordly App uses React Contexts for global state management. Each context handles a specific concern.

---

## Context Files

```
contexts/
├── ThemeContext.tsx       # Theme mode, style, colors
├── AuthContext.tsx        # User authentication
├── DrawerContext.tsx      # Drawer open/close state
├── QuickActionsContext.tsx # FAB menu state
├── DynamicTabContext.tsx  # Dynamic tab configuration
├── SettingsContext.tsx    # User settings persistence
└── FeedbackContext.tsx    # Feedback modal state
```

---

## 1. ThemeContext

Manages theme mode (light/dark) and style variations.

### Usage
```tsx
import { useTheme, useThemeColors, useIsDark } from '@/contexts/ThemeContext';

// Full context
const { mode, style, isDark, colors, toggleMode, setStyle } = useTheme();

// Just colors (convenience)
const colors = useThemeColors();

// Just dark mode check
const isDark = useIsDark();
```

### API
| Property/Method | Type | Description |
|-----------------|------|-------------|
| `mode` | `'light' \| 'dark'` | Current theme mode |
| `style` | `ThemeStyle` | Current style (grey, forest, etc.) |
| `isDark` | `boolean` | Is dark mode active |
| `colors` | `ThemePalette` | Current color palette |
| `theme` | `ThemeDefinition` | Full theme definition |
| `setMode(mode)` | function | Set theme mode |
| `setStyle(style)` | function | Set theme style |
| `toggleMode()` | function | Toggle light/dark |
| `getAvailableStyles()` | function | Get styles for current mode |

### Persistence
Stored in AsyncStorage: `@affordly/theme`

---

## 2. AuthContext

Manages user authentication state.

### Usage
```tsx
import { useAuth } from '@/contexts/AuthContext';

const { user, isAuthenticated, signIn, signOut, updateUser } = useAuth();
```

### API
| Property/Method | Type | Description |
|-----------------|------|-------------|
| `user` | `UserInfo \| null` | Current user |
| `isAuthenticated` | `boolean` | Auth status |
| `signIn(user)` | function | Sign in user |
| `signOut()` | function | Sign out user |
| `updateUser(updates)` | function | Update user info |

### User Info Interface
```typescript
interface UserInfo {
  name: string;
  subtitle?: string;
  email?: string;
  avatarUrl?: string;
}
```

---

## 3. DrawerContext

Manages drawer navigation state.

### Usage
```tsx
import { useDrawer } from '@/contexts/DrawerContext';

const { isOpen, openDrawer, closeDrawer, toggleDrawer } = useDrawer();
```

### API
| Property/Method | Type | Description |
|-----------------|------|-------------|
| `isOpen` | `boolean` | Drawer open state |
| `openDrawer()` | function | Open drawer |
| `closeDrawer()` | function | Close drawer |
| `toggleDrawer()` | function | Toggle drawer |

---

## 4. QuickActionsContext

Manages the FAB quick actions menu state.

### Usage
```tsx
import { useQuickActions } from '@/contexts/QuickActionsContext';

const { isOpen, openQuickActions, closeQuickActions, toggleQuickActions } = useQuickActions();
```

### API
| Property/Method | Type | Description |
|-----------------|------|-------------|
| `isOpen` | `boolean` | Menu open state |
| `openQuickActions()` | function | Open menu |
| `closeQuickActions()` | function | Close menu |
| `toggleQuickActions()` | function | Toggle menu |

---

## 5. DynamicTabContext

Allows runtime configuration of the tab bar.

### Usage
```tsx
import { useDynamicTabs } from '@/contexts/DynamicTabContext';

const { currentConfig, setTabConfig, resetToDefault, setFloatingActionHandler } = useDynamicTabs();
```

### API
| Property/Method | Type | Description |
|-----------------|------|-------------|
| `currentConfig` | `TabBarConfig` | Current tab configuration |
| `setTabConfig(config)` | function | Set custom tab config |
| `resetToDefault()` | function | Reset to default tabs |
| `setFloatingActionHandler(fn)` | function | Custom FAB handler |

### Tab Config Interface
```typescript
interface TabBarConfig {
  tabs: TabItem[];
  floatingAction?: {
    icon: string;
    color?: string;
    onPress?: () => void;
  };
}
```

---

## 6. SettingsContext

Manages persistent user settings.

### Usage
```tsx
import { 
  useSettings, 
  useUserProfile, 
  useTeam, 
  useCategories 
} from '@/contexts/SettingsContext';

// Full settings
const { settings, updateProfile, updateNotifications } = useSettings();

// Convenience hooks
const profile = useUserProfile();
const team = useTeam();
const categories = useCategories();
```

### Settings Structure
```typescript
interface AppSettings {
  profile: UserProfileSettings;
  team: TeamSettings;
  categories: Category[];
  notifications: NotificationSettings;
  preferences: AppPreferences;
  lastUpdated: string;
}
```

### API
| Method | Description |
|--------|-------------|
| `updateProfile(profile)` | Update user profile |
| `updateTeam(team)` | Update team settings |
| `addTeamMember(member)` | Add team member |
| `removeTeamMember(id)` | Remove team member |
| `addCategory(category)` | Add expense category |
| `removeCategory(id)` | Remove category |
| `updateNotifications(settings)` | Update notification prefs |
| `updatePreferences(prefs)` | Update app preferences |

### Persistence
Stored in AsyncStorage: `@affordly/settings`

---

## 7. FeedbackContext

Manages the feedback modal state.

### Usage
```tsx
import { useFeedback } from '@/contexts/FeedbackContext';

const { isModalVisible, openFeedbackModal, closeFeedbackModal, submitFeedback } = useFeedback();
```

### API
| Property/Method | Type | Description |
|-----------------|------|-------------|
| `isModalVisible` | `boolean` | Modal visibility |
| `openFeedbackModal()` | function | Show modal |
| `closeFeedbackModal()` | function | Hide modal |
| `submitFeedback(data)` | function | Submit feedback |

---

## Provider Hierarchy

Contexts are provided in a specific order in the app:

```tsx
// app/_layout.tsx
<ThemeProvider>
  <AppShellProvider>
    {/* Contains: AuthProvider, DrawerProvider, DynamicTabProvider, QuickActionsProvider */}
    <SettingsProvider>
      <FeedbackProvider>
        <Slot />
      </FeedbackProvider>
    </SettingsProvider>
  </AppShellProvider>
</ThemeProvider>
```

---

## Best Practices

### 1. Use Hooks, Not Context Directly
```tsx
// ✅ Good
const { colors } = useTheme();

// ❌ Bad
const context = useContext(ThemeContext);
```

### 2. Destructure Only What You Need
```tsx
// ✅ Good - only get what's needed
const { toggleMode } = useTheme();

// ⚠️ Okay but may cause extra re-renders
const theme = useTheme();
```

### 3. Check Context Existence
All hooks throw if used outside their provider:
```tsx
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

### 4. Use Convenience Hooks
```tsx
// For just colors
const colors = useThemeColors();

// For just dark mode check
const isDark = useIsDark();

// For just profile
const profile = useUserProfile();
```

---

## Adding a New Context

1. Create `contexts/NewContext.tsx`:
```tsx
import React, { createContext, useContext, useState } from 'react';

interface NewContextType {
  value: string;
  setValue: (val: string) => void;
}

const NewContext = createContext<NewContextType | undefined>(undefined);

export function NewProvider({ children }) {
  const [value, setValue] = useState('');
  
  return (
    <NewContext.Provider value={{ value, setValue }}>
      {children}
    </NewContext.Provider>
  );
}

export function useNew() {
  const context = useContext(NewContext);
  if (!context) {
    throw new Error('useNew must be used within NewProvider');
  }
  return context;
}
```

2. Wrap app with provider in `_layout.tsx` or `AppShell.tsx`

3. Use hook in components:
```tsx
const { value, setValue } = useNew();
```
