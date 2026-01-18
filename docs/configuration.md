# Configuration System

All app customization happens through configuration files in the `config/` directory. This approach allows rapid customization without modifying component code.

---

## Configuration Files Overview

| File | Purpose |
|------|---------|
| `auth.config.ts` | Authentication type, branding, version info |
| `tabs.navigation.ts` | Bottom tab bar items |
| `site.navigation.ts` | Side drawer menu items |
| `quickactions.navigation.ts` | FAB quick action items |
| `app.ts` | Feature flags, colors, default user |
| `index.ts` | Barrel export for all configs |

---

## 1. Authentication Config

`config/auth.config.ts`

### Auth Type Selection
```typescript
export const AUTH_TYPE: AuthType = 'standard'; // or 'otp'
```

### Branding
```typescript
export const brandingConfig: BrandingConfig = {
  appName: 'Mobile Starter',
  tagline: 'Your app, your way',
  // logoSource: require('@/assets/images/logo.png'),
  // iconSource: require('@/assets/images/icon.png'),
  showAppNameWithLogo: true,
  companyName: 'Your Company',
  copyrightText: '© 2026 Your Company. All rights reserved.',
};
```

### Version Info
```typescript
export const versionInfo: VersionInfo = {
  version: '1.0.0',
  buildNumber: '1',
  buildDate: '1/18/2026',
};
```

### Legal Links
```typescript
export const legalLinksConfig: LegalLinksConfig = {
  termsOfService: 'https://example.com/terms',
  privacyPolicy: 'https://example.com/privacy',
  cookiePolicy: 'https://example.com/cookies',
  help: 'https://example.com/help',
};
```

### Social Providers
```typescript
export const socialProvidersConfig: SocialProviderConfig[] = [
  {
    provider: 'google',
    enabled: true,
    clientId: '', // Add your client ID
    label: 'Continue with Google',
    comingSoon: false,
  },
  // ... more providers
];
```

### Standard Auth Settings
```typescript
export const standardAuthConfig: StandardAuthConfig = {
  enableEmailPassword: true,
  enableSignup: true,
  enableForgotPassword: true,
  enableRememberMe: true,
  socialProviders: socialProvidersConfig,
  minPasswordLength: 8,
  requireEmailVerification: false,
};
```

### OTP Auth Settings
```typescript
export const otpAuthConfig: OTPAuthConfig = {
  deliveryMethod: 'sms', // 'sms', 'email', or 'both'
  codeLength: 6,
  expirationSeconds: 300,
  resendCooldownSeconds: 60,
  maxResendAttempts: 3,
  enableMagicLink: true,
  defaultCountryCode: '+1',
};
```

---

## 2. Tabs Navigation Config

`config/tabs.navigation.ts`

### Structure
```typescript
import type { TabItem } from '@/interfaces';

const tabsNavigation: TabItem[] = [
  {
    name: 'index',         // Must match file name
    title: 'Overview',     // Display label
    icon: 'pie-chart',     // Ionicons name
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
```

### Adding a Tab
1. Create `app/(tabs)/newtab.tsx`
2. Add entry to array
3. Register in `app/(tabs)/_layout.tsx`

---

## 3. Site Navigation Config

`config/site.navigation.ts`

### Structure
```typescript
import type { DrawerMenuItem } from '@/interfaces';

const siteNavigation: DrawerMenuItem[] = [
  // Regular menu item with route
  {
    id: 'scenarios',
    title: 'What-If Scenarios',
    icon: 'bulb',
    route: '/scenarios',
  },
  
  // External URL item
  {
    id: 'help',
    title: 'Help & Instructions',
    icon: 'help-circle',
    url: 'https://example.com/help',
  },
  
  // Action item with divider
  {
    id: 'settings',
    title: 'Settings',
    icon: 'settings',
    action: 'settings',
    route: '/settings',
    dividerAfter: true,
  },
  
  // Sign out action
  {
    id: 'signout',
    title: 'Sign Out',
    icon: 'log-out',
    action: 'signout',
  },
];

export default siteNavigation;
```

### Menu Item Options
| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique identifier |
| `title` | string | Display text |
| `icon` | string | Ionicons name |
| `route` | string | Internal route path |
| `url` | string | External URL |
| `action` | string | Special action |
| `dividerAfter` | boolean | Show divider after |

### Actions
- `settings` - Navigate to settings
- `signout` - Show sign out dialog
- `feedback` - Open feedback modal
- `help` - Show help info

---

## 4. Quick Actions Config

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
    id: 'quick-note',
    title: 'Quick Note',
    icon: 'create',
    action: 'quick-note',
    color: '#10B981',  // Custom color
  },
  {
    id: 'external-link',
    title: 'Visit Website',
    icon: 'globe',
    url: 'https://example.com',
  },
];

export default quickActionsNavigation;
```

---

## 5. App Config

`config/app.ts`

### App Identity
```typescript
export const appIdentity: AppIdentity = {
  appName: brandingConfig.appName,
  appTagline: brandingConfig.tagline,
  version: versionInfo.version,
  buildNumber: versionInfo.buildNumber,
  buildDate: versionInfo.buildDate,
};
```

### Brand Colors
```typescript
export const appColors: AppColors = {
  primary: '#6366F1',      // Indigo
  primaryLight: '#818CF8',
  secondary: '#3B82F6',    // Blue
  accent: '#F97316',       // Orange
  danger: '#EF4444',       // Red
  success: '#10B981',      // Emerald
  warning: '#F59E0B',      // Amber
  background: '#0F172A',   // Dark slate
  surface: '#1E293B',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  border: '#334155',
};
```

### Feature Flags
```typescript
export const appFeatures: AppFeatures = {
  showUserAvatar: true,
  showNotificationBell: true,
  showQuickActionButton: true,
  hapticFeedback: true,
};
```

### Default User (Guest Mode)
```typescript
export const defaultUser: UserInfo = {
  name: 'Guest User',
  subtitle: 'Welcome to the App',
};
```

---

## Using Configs in Components

### Import from Index
```typescript
import { 
  appIdentity,
  appFeatures,
  tabsNavigation,
  siteNavigation,
  quickActionsNavigation,
  authConfig,
} from '@/config';
```

### Direct Import
```typescript
import tabsNavigation from '@/config/tabs.navigation';
```

---

## TypeScript Interfaces

All configuration interfaces are defined in `interfaces/`:

```typescript
// interfaces/app.ts
interface AppIdentity {
  appName: string;
  appTagline: string;
  version: string;
  buildNumber?: string;
  buildDate?: string;
}

interface AppFeatures {
  showUserAvatar: boolean;
  showNotificationBell: boolean;
  showQuickActionButton: boolean;
  hapticFeedback: boolean;
}

// interfaces/navigation.ts
interface TabItem {
  name: string;
  title: string;
  icon: string;
}

interface DrawerMenuItem {
  id: string;
  title: string;
  icon: string;
  route?: string;
  url?: string;
  action?: string;
  dividerAfter?: boolean;
}

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

1. **Type everything** - Always import and use TypeScript interfaces
2. **Match file names** - Tab `name` must match file in `app/(tabs)/`
3. **Use unique IDs** - Each navigation item needs a unique `id`
4. **Test configs** - Verify routes exist before adding to navigation
5. **Keep configs focused** - One concern per file
6. **Document changes** - Comment non-obvious configurations

---

## Common Tasks

### Change app name
1. Edit `config/auth.config.ts`:
```typescript
export const brandingConfig = {
  appName: 'New App Name',
  // ...
};
```

### Add new tab
1. Create `app/(tabs)/newtab.tsx`
2. Add to `config/tabs.navigation.ts`
3. Register in `app/(tabs)/_layout.tsx`

### Add drawer item
1. Add to `config/site.navigation.ts`
2. Create screen file if needed

### Disable feature
1. Edit `config/app.ts`:
```typescript
export const appFeatures = {
  showNotificationBell: false,  // Disabled
  // ...
};
```

### Switch auth type
1. Edit `config/auth.config.ts`:
```typescript
export const AUTH_TYPE: AuthType = 'otp';  // or 'standard'
```
