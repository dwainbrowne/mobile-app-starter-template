# Architecture Overview

The Mobile Starter Template uses a **configuration-driven shell architecture** that separates UI components from their configuration, making it highly customizable without modifying component code.

## Core Principles

### 1. Configuration-Driven UI
All navigation and branding settings are defined in config files, not hardcoded in components:

```
config/
├── auth.config.ts         # Auth type, branding, version
├── tabs.navigation.ts     # Bottom tab items
├── site.navigation.ts     # Drawer menu items
├── quickactions.navigation.ts  # FAB menu items
└── app.ts                 # Feature flags, colors
```

### 2. Context-Based State Management
Global state is managed through React Contexts:

```
contexts/
├── ThemeContext.tsx       # Theme mode, style, colors
├── AuthContext.tsx        # User authentication state
├── DrawerContext.tsx      # Drawer open/close state
├── QuickActionsContext.tsx # FAB menu state
├── DynamicTabContext.tsx  # Dynamic tab configuration
├── SettingsContext.tsx    # User settings persistence
└── FeedbackContext.tsx    # Feedback modal state
```

### 3. Type-Safe Interfaces
All data structures are defined with TypeScript interfaces:

```
interfaces/
├── app.ts                 # App identity, features
├── auth.ts                # Authentication types
├── navigation.ts          # Tab, drawer, action items
├── settings.ts            # User preferences
├── theme.ts               # Theme definitions
└── feedback.ts            # Feedback types
```

---

## Application Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         RootLayout                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    ThemeProvider                          │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │                  AppShellProvider                   │  │  │
│  │  │  ┌───────────────────────────────────────────────┐  │  │  │
│  │  │  │ AuthProvider → DrawerProvider → TabProvider  │  │  │  │
│  │  │  │  ┌─────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │         SettingsProvider               │  │  │  │  │
│  │  │  │  │  ┌───────────────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │       FeedbackProvider           │  │  │  │  │  │
│  │  │  │  │  │  ┌─────────────────────────────┐  │  │  │  │  │  │
│  │  │  │  │  │  │      Slot (Routes)         │  │  │  │  │  │  │
│  │  │  │  │  │  └─────────────────────────────┘  │  │  │  │  │  │
│  │  │  │  │  └───────────────────────────────────┘  │  │  │  │  │
│  │  │  │  └─────────────────────────────────────────┘  │  │  │  │
│  │  │  └───────────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## File-Based Routing (Expo Router)

The app uses Expo Router for navigation with file-based routing:

```
app/
├── _layout.tsx            # Root layout with providers
├── login.tsx              # Login screen (auth)
├── settings.tsx           # Settings screen
├── notifications.tsx      # Notifications inbox
├── modal.tsx              # Modal screen
└── (tabs)/
    ├── _layout.tsx        # Tab layout with shell
    ├── index.tsx          # Home/Overview tab
    ├── transactions.tsx   # Transactions tab
    ├── recurring.tsx      # Recurring tab
    ├── receipts.tsx       # Receipts tab
    ├── add.tsx            # Hidden - Add screen
    └── explore.tsx        # Hidden - Explore screen
```

### Route Groups
- `(tabs)/` - Tab-based navigation screens
- Files outside groups are standalone screens

### Protected Routes
Routes are protected via the `useProtectedRoute` hook in `_layout.tsx`:
- Unauthenticated users → `/login`
- Authenticated users on login → `/(tabs)`

---

## Component Architecture

### App Shell Components

```
components/app-shell/
├── AppShell.tsx           # Main wrapper (providers + content)
├── Header.tsx             # Top app bar with menu, title, actions
├── Drawer.tsx             # Slide-out navigation menu
├── CustomTabBar.tsx       # Dynamic bottom tab bar
├── QuickActionsMenu.tsx   # FAB slide-up menu
└── index.ts               # Barrel export
```

### UI Components

```
components/ui/
├── Card.tsx               # Card and CardSection
├── Modal.tsx              # Reusable modal
├── collapsible.tsx        # Collapsible content
├── icon-symbol.tsx        # Platform-specific icons
└── index.ts               # Barrel export
```

### Auth Components

```
components/auth/
├── LoginShell.tsx         # Auth type switcher
├── StandardLoginScreen.tsx # Email/password login
├── OTPLoginScreen.tsx     # OTP/magic link login
└── index.ts               # Barrel export
```

---

## Data Flow

### Theme Flow
```
ThemeContext → useTheme() / useThemeColors()
                    ↓
              All Components
```

### Auth Flow
```
AuthContext → useAuth()
                  ↓
          signIn() / signOut()
                  ↓
         Protected Route Guard
```

### Navigation Config Flow
```
config/tabs.navigation.ts → DynamicTabContext → CustomTabBar
config/site.navigation.ts → Drawer Component
config/quickactions.navigation.ts → QuickActionsMenu
```

---

## Key Design Decisions

### Why Configuration-Driven?
1. **Rapid customization** - Change app behavior without touching component code
2. **Type safety** - TypeScript interfaces ensure config validity
3. **Maintainability** - Clear separation of concerns
4. **Reusability** - Shell can be reused for different apps

### Why Contexts over Redux/Zustand?
1. **Simplicity** - Built-in React feature, no extra dependencies
2. **Co-location** - State logic near related UI
3. **Performance** - Selective re-rendering with multiple contexts
4. **Learning curve** - Easier for team adoption

### Why Expo Router?
1. **File-based routing** - Intuitive, mirrors web conventions
2. **Deep linking** - Automatic URL handling
3. **Type safety** - Built-in TypeScript support
4. **Web support** - Same code runs on web

---

## Extending the Architecture

### Adding a New Screen
1. Create file in `app/` or `app/(tabs)/`
2. If tab screen, add to `config/tabs.navigation.ts`
3. If drawer item, add to `config/site.navigation.ts`

### Adding a New Context
1. Create `contexts/NewContext.tsx`
2. Export provider and hook
3. Wrap app in `_layout.tsx` or `AppShell.tsx`

### Adding a New Config
1. Create `config/newconfig.ts`
2. Define TypeScript interface in `interfaces/`
3. Export from `config/index.ts`

---

*See individual documentation files for detailed information on each subsystem.*
