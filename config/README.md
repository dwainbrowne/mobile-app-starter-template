# App Shell Configuration Guide

This app uses a **configuration-driven shell** that makes it easy to customize navigation, branding, authentication, themes, and features without modifying the core code.

## File Structure

```
config/
├── index.ts                    # Central exports
├── app.ts                      # App identity, colors, features
├── auth.config.ts              # Authentication & branding config ⭐ NEW
├── tabs.navigation.ts          # Bottom tab bar items
├── site.navigation.ts          # Slide-out drawer menu items
└── quickactions.navigation.ts  # Slide-up FAB menu items

interfaces/
├── index.ts                    # Central exports
├── app.ts                      # App-related interfaces
├── auth.ts                     # Authentication interfaces ⭐ NEW
├── navigation.ts               # Navigation-related interfaces
└── theme.ts                    # Theme interfaces

constants/
└── themes.ts                   # Theme definitions (light & dark variants)

components/
└── auth/
    ├── index.ts                # Auth component exports
    ├── LoginShell.tsx          # Auto-selecting login wrapper
    ├── StandardLoginScreen.tsx # Email/password + social login
    └── OTPLoginScreen.tsx      # Phone/email OTP verification
```

## Quick Start

All customization happens in the `config/` folder. Each configuration type has its own file for clarity.

---

## 🔐 Authentication Configuration (`config/auth.config.ts`) ⭐ NEW

The app supports **TWO independent authentication systems** that can be switched with a single config change:

### Authentication Types

| Type | Description | Use Case |
|------|-------------|----------|
| `standard` | Email/password + social login (Google, Apple) | Consumer apps, traditional auth |
| `otp` | Phone/email verification + magic links | Mobile-first apps, high security |

### Switching Auth Types

```typescript
// In config/auth.config.ts

// Option 1: Standard Auth (email/password + social)
export const AUTH_TYPE: AuthType = 'standard';

// Option 2: OTP Auth (phone/email verification)
export const AUTH_TYPE: AuthType = 'otp';
```

### Branding Configuration

```typescript
export const brandingConfig: BrandingConfig = {
  appName: 'Mobile Starter',
  tagline: 'Your app, your way',
  // logoSource: require('@/assets/images/logo.png'),  // Add your logo
  // iconSource: require('@/assets/images/icon.png'),  // Add your icon
  showAppNameWithLogo: true,
  companyName: 'Your Company',
  copyrightText: '© 2026 Your Company. All rights reserved.',
};
```

### Version Information

```typescript
export const versionInfo: VersionInfo = {
  version: '1.0.0',      // Semantic version
  buildNumber: '79',     // Build number
  buildDate: '1/18/2026', // Build date (optional)
};
```

### Legal Links

```typescript
export const legalLinksConfig: LegalLinksConfig = {
  termsOfService: 'https://yourapp.com/terms',
  privacyPolicy: 'https://yourapp.com/privacy',
  cookiePolicy: 'https://yourapp.com/cookies',
  help: 'https://yourapp.com/help',
};
```

### Social Providers (Standard Auth)

```typescript
export const socialProvidersConfig: SocialProviderConfig[] = [
  {
    provider: 'google',
    enabled: true,
    clientId: 'YOUR_GOOGLE_CLIENT_ID',
    label: 'Continue with Google',
    comingSoon: false,
  },
  {
    provider: 'apple',
    enabled: true,
    clientId: 'YOUR_APPLE_CLIENT_ID',
    label: 'Continue with Apple',
    comingSoon: true,  // Shows "Coming Soon" badge
  },
];
```

### OTP Configuration (OTP Auth)

```typescript
export const otpAuthConfig: OTPAuthConfig = {
  deliveryMethod: 'sms',      // 'sms' | 'email' | 'both'
  codeLength: 6,              // OTP code length (4-6)
  expirationSeconds: 300,     // Code validity (5 min)
  resendCooldownSeconds: 60,  // Time between resends
  maxResendAttempts: 3,       // Max resend attempts
  enableMagicLink: true,      // Enable magic link alternative
  defaultCountryCode: '+1',   // Default phone country code
};
```

### Using the Login Shell

```tsx
import { LoginShell } from '@/components/auth';

// In your login screen
export default function LoginScreen() {
  return (
    <LoginShell
      // Standard auth callbacks
      onSignIn={handleSignIn}
      onSignUp={handleSignUp}
      onSocialSignIn={handleSocialSignIn}
      onForgotPassword={handleForgotPassword}
      // OTP auth callbacks
      onRequestOTP={handleRequestOTP}
      onVerifyOTP={handleVerifyOTP}
      onRequestMagicLink={handleMagicLink}
    />
  );
}
```

---

## 🎨 Theme Configuration (`constants/themes.ts`)

### Available Themes

| Mode | Theme | Description |
|------|-------|-------------|
| Light | `grey` | Clean neutral (default) |
| Light | `emerald` | Fresh green |
| Light | `violet` | Purple-blue gradient |
| Dark | `grey` | Classic neutral |
| Dark | `forest` | Nature-inspired green |
| Dark | `ocean` | Deep blue oceanic |
| Dark | `midnight` | Pure black OLED-friendly |

### Changing Default Theme

```typescript
// In constants/themes.ts

export const defaultThemeConfig = {
  mode: 'light' as const,    // 'light' or 'dark'
  style: 'emerald' as ThemeStyle,  // Theme variant
};
```

### Theme Mapping

When switching modes, themes automatically map:
- `emerald` (light) ↔ `forest` (dark)
- `violet` (light) ↔ `midnight` (dark)
- `grey` works in both modes

---

## Configuration Files

### 1. App Config (`config/app.ts`)

Core app settings:

```typescript
// App Identity
export const appIdentity = {
  appName: 'MOBILE STARTER',
  appTagline: 'Your App, Your Way',
  version: '1.0.0',
};

// Branding Colors
export const appColors = {
  primary: '#16A34A',      // Green - main brand color
  primaryLight: '#22C55E',
  secondary: '#0EA5E9',    // Blue - secondary actions
  accent: '#F59E0B',       // Amber - highlights
  danger: '#EF4444',       // Red - destructive actions
  success: '#10B981',      // Emerald - success states
  warning: '#F59E0B',      // Amber - warnings
  background: '#FFFFFF',   // Main background
  surface: '#F8FAFC',      // Card/surface background
  text: '#1E293B',         // Primary text
  textSecondary: '#64748B', // Secondary text
  border: '#E2E8F0',       // Border color
};

// Feature Flags
export const appFeatures = {
  showUserAvatar: true,
  showNotificationBell: true,
  showQuickActionButton: true,  // FAB button
  hapticFeedback: true,
};

// Default User (Guest Mode)
export const defaultUser = {
  name: 'Guest User',
  subtitle: 'Welcome to the App',
};
```

---

### 2. Tabs Navigation (`config/tabs.navigation.ts`)

Bottom tab bar items. Each tab needs a matching file in `app/(tabs)/`:

```typescript
const tabsNavigation = [
  {
    name: 'index',        // Must match filename in app/(tabs)/
    title: 'Overview',    // Display title
    icon: 'pie-chart',    // Ionicons name
  },
  {
    name: 'transactions',
    title: 'Transactions',
    icon: 'swap-horizontal',
  },
  // Add more tabs...
];
```

**Icons:** Use [Ionicons](https://ionic.io/ionicons) names directly.

---

### 3. Site Navigation (`config/site.navigation.ts`)

Slide-out drawer menu (hamburger menu):

```typescript
const siteNavigation = [
  {
    id: 'scenarios',
    title: 'What-If Scenarios',
    icon: 'bulb',
    route: '/scenarios',        // Internal route
  },
  {
    id: 'help',
    title: 'Help Center',
    icon: 'help-circle',
    url: 'https://help.example.com',  // External URL
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: 'settings',
    action: 'settings',         // Special action
    route: '/settings',
    dividerAfter: true,         // Show divider after
  },
  {
    id: 'signout',
    title: 'Sign Out',
    icon: 'log-out',
    action: 'signout',
  },
];
```

**Options:**
- `route`: Internal app navigation
- `url`: Opens external URL in browser
- `action`: Special actions (`settings`, `signout`, `feedback`, `help`)
- `dividerAfter`: Visual separator

---

### 4. Quick Actions Navigation (`config/quickactions.navigation.ts`)

Slide-up menu from floating action button (FAB):

```typescript
const quickActionsNavigation = [
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
    url: 'https://example.com',  // Opens in browser
  },
  {
    id: 'custom-action',
    title: 'Quick Note',
    icon: 'create',
    color: '#F59E0B',            // Custom icon color
    action: 'quick-note',        // Custom action handler
  },
];
```

---

## Adding New Navigation Items

### Add a New Tab

1. Create file in `app/(tabs)/` (e.g., `budget.tsx`)
2. Add to `config/tabs.navigation.ts`:
   ```typescript
   {
     name: 'budget',
     title: 'Budget',
     icon: 'wallet',
   }
   ```

### Add a Drawer Menu Item

1. (Optional) Create screen in `app/` (e.g., `reports.tsx`)
2. Add to `config/site.navigation.ts`:
   ```typescript
   {
     id: 'reports',
     title: 'Reports',
     icon: 'bar-chart',
     route: '/reports',
   }
   ```

### Add a Quick Action

Add to `config/quickactions.navigation.ts`:
```typescript
{
  id: 'new-action',
  title: 'New Action',
  icon: 'add-circle',
  route: '/new-action',  // or url: 'https://...'
}
```

---

## Contexts (Hooks)

### useDrawer()
```typescript
const { isOpen, openDrawer, closeDrawer, toggleDrawer } = useDrawer();
```

### useAuth()
```typescript
const { user, isAuthenticated, signIn, signOut, updateUser } = useAuth();
```

### useQuickActions()
```typescript
const { isOpen, openQuickActions, closeQuickActions, toggleQuickActions } = useQuickActions();
```

---

## Customizing for a New App

1. Update `config/app.ts` with your branding
2. Update `config/tabs.navigation.ts` for your bottom tabs
3. Update `config/site.navigation.ts` for your drawer menu
4. Update `config/quickactions.navigation.ts` for FAB actions
5. Create matching screen files in `app/`
