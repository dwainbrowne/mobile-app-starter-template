# Getting Started

This guide will help you set up and run the Affordly App on your local machine.

---

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn**
- **Expo CLI** (installed globally or via npx)
- **iOS Simulator** (macOS only) or **Android Emulator**
- **Expo Go** app on your physical device (optional)

---

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd affordly-app-expo
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Start Development Server
```bash
npx expo start
```

---

## Running the App

After starting the development server, you'll see options:

| Key | Platform |
|-----|----------|
| `i` | Open iOS Simulator |
| `a` | Open Android Emulator |
| `w` | Open in Web Browser |
| `r` | Reload app |
| `m` | Toggle menu |
| `j` | Open debugger |

### On Physical Device
1. Install **Expo Go** from App Store / Play Store
2. Scan the QR code shown in terminal
3. App will load on your device

---

## Project Structure

```
affordly-app-expo/
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Root layout
│   ├── login.tsx           # Login screen
│   ├── settings.tsx        # Settings screen
│   ├── notifications.tsx   # Notifications inbox
│   └── (tabs)/             # Tab screens
│       ├── _layout.tsx     # Tab layout
│       ├── index.tsx       # Overview tab
│       ├── transactions.tsx
│       ├── recurring.tsx
│       └── receipts.tsx
├── components/             # Reusable components
│   ├── app-shell/          # Header, Drawer, TabBar
│   ├── auth/               # Login screens
│   ├── feedback/           # Feedback components
│   └── ui/                 # Card, Modal, etc.
├── config/                 # App configuration
│   ├── auth.config.ts      # Auth settings
│   ├── tabs.navigation.ts  # Tab bar items
│   ├── site.navigation.ts  # Drawer menu items
│   └── quickactions.navigation.ts
├── constants/              # Theme definitions
├── contexts/               # React contexts
├── interfaces/             # TypeScript types
├── mocks/                  # Mock data
├── services/               # Utilities
└── docs/                   # Documentation
```

---

## Quick Configuration

### Change App Name
Edit `config/auth.config.ts`:
```typescript
export const brandingConfig = {
  appName: 'Your App Name',
  tagline: 'Your tagline here',
};
```

### Switch Auth Type
Edit `config/auth.config.ts`:
```typescript
export const AUTH_TYPE: AuthType = 'standard'; // or 'otp'
```

### Modify Tab Bar
Edit `config/tabs.navigation.ts`:
```typescript
const tabsNavigation: TabItem[] = [
  { name: 'index', title: 'Home', icon: 'home' },
  // Add/remove tabs here
];
```

### Change Default Theme
Edit `constants/themes.ts`:
```typescript
export const defaultThemeConfig = {
  mode: 'dark',      // 'light' or 'dark'
  style: 'ocean',    // Theme style
};
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npx expo start` | Start development server |
| `npx expo start --ios` | Start with iOS |
| `npx expo start --android` | Start with Android |
| `npx expo start --web` | Start with web |
| `npm run lint` | Run ESLint |
| `npm run reset-project` | Move starter code |

---

## Development Tips

### Hot Reloading
The app automatically reloads when you save files.

### Debugging
- Press `j` in terminal to open React DevTools
- Use `console.log()` for quick debugging
- Check Metro bundler for errors

### TypeScript
The project uses strict TypeScript. Always:
- Import types from `@/interfaces`
- Use proper type annotations
- Check for type errors before committing

### Path Aliases
Use `@/` prefix for imports:
```typescript
// ✅ Good
import { useTheme } from '@/contexts/ThemeContext';

// ❌ Avoid
import { useTheme } from '../../contexts/ThemeContext';
```

---

## Common Issues

### Metro Bundler Issues
```bash
# Clear cache and restart
npx expo start --clear
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### iOS Simulator Not Opening
```bash
# Open Simulator manually first
open -a Simulator
```

### Android Emulator Issues
Ensure Android Studio and emulator are properly set up.

---

## Next Steps

1. Read the [Architecture Overview](./architecture.md)
2. Explore [Configuration Options](./configuration.md)
3. Understand the [Theming System](./theming.md)
4. Learn about [Navigation](./navigation.md)
5. Review [Authentication](./authentication.md)

---

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Docs](https://expo.github.io/router/docs/)
- [React Native Docs](https://reactnative.dev/)
- [Ionicons](https://ionic.io/ionicons)
