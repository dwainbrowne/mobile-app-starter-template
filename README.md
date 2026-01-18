# 📱 Mobile Starter Template

A **production-ready React Native starter template** built with Expo Router featuring a configuration-driven architecture. Build beautiful, customizable mobile apps in minutes.

![Expo](https://img.shields.io/badge/Expo-54-blue?logo=expo)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- 🎨 **Multi-Theme System** - Light & dark modes with 6+ theme styles
- 🔐 **Dual Authentication** - Standard (email/password) or OTP (phone/email verification)
- 📱 **Configuration-Driven** - Customize everything via config files, no code changes needed
- 🧭 **Complete Navigation** - Tab bar, side drawer, and quick action FAB
- 🎭 **Beautiful UI Components** - Cards, modals, themed views, and more
- 📝 **TypeScript First** - Fully typed with comprehensive interfaces
- 🚀 **Expo Router** - File-based routing with typed routes
- 🔔 **Notifications Screen** - Ready-to-use notification center
- ⚙️ **Settings System** - Persistent user preferences

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator, Android Emulator, or [Expo Go](https://expo.dev/go)

### Installation

```bash
# Clone the repository
git clone https://github.com/dwainbrowne/mobile-app-starter-template.git

# Navigate to the project
cd mobile-app-starter-template

# Install dependencies
npm install

# Start the development server
npx expo start
```

Then press:
- `i` - Open iOS Simulator
- `a` - Open Android Emulator
- `w` - Open in Web Browser

---

## 📁 Project Structure

```
├── app/                    # Expo Router file-based routing
│   ├── (tabs)/            # Tab navigation screens
│   ├── _layout.tsx        # Root layout
│   └── [screen].tsx       # Individual screens
├── components/            # Reusable components
│   ├── app-shell/         # AppShell, Header, Drawer, CustomTabBar
│   ├── auth/              # Login screens (Standard, OTP)
│   ├── feedback/          # Feedback modal components
│   └── ui/                # Card, Modal, ScreenWrapper
├── config/                # ⭐ Configuration files (customize here!)
│   ├── auth.config.ts     # Authentication settings & branding
│   ├── tabs.navigation.ts # Bottom tab bar items
│   ├── site.navigation.ts # Side drawer menu items
│   └── quickactions.navigation.ts # FAB menu items
├── contexts/              # React Context providers
├── interfaces/            # TypeScript type definitions
├── mocks/                 # Mock data for development
├── constants/             # Theme definitions
└── services/              # Utility services
```

---

## ⚙️ Configuration

### 🎨 Branding

Edit `config/auth.config.ts`:

```typescript
export const brandingConfig = {
  appName: 'Your App Name',
  tagline: 'Your tagline here',
  companyName: 'Your Company',
  copyrightText: '© 2026 Your Company',
};
```

### 🔐 Authentication

Switch between auth types in `config/auth.config.ts`:

```typescript
// Standard: email/password + social login
export const AUTH_TYPE: AuthType = 'standard';

// OTP: phone/email verification
export const AUTH_TYPE: AuthType = 'otp';
```

### 🧭 Navigation

**Bottom Tabs** - `config/tabs.navigation.ts`:
```typescript
const tabsNavigation = [
  { name: 'index', title: 'Home', icon: 'home' },
  { name: 'explore', title: 'Explore', icon: 'compass' },
];
```

**Side Drawer** - `config/site.navigation.ts`:
```typescript
const siteNavigation = [
  { id: 'settings', title: 'Settings', icon: 'settings', route: '/settings' },
  { id: 'help', title: 'Help', icon: 'help-circle', url: 'https://...' },
];
```

### 🎨 Themes

Available themes in `constants/themes.ts`:

| Mode | Themes |
|------|--------|
| Light | Grey (default), Emerald, Violet |
| Dark | Grey, Forest, Ocean, Midnight |

---

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

- [Getting Started](docs/getting-started.md)
- [Architecture Overview](docs/architecture.md)
- [Configuration Guide](docs/configuration.md)
- [Theming System](docs/theming.md)
- [Authentication](docs/authentication.md)
- [Backend Integration](docs/backend-integration.md)
- [Components](docs/components/app-shell.md)

---

## 🛠 Scripts

```bash
npx expo start          # Start development server
npx expo start --ios    # Start on iOS
npx expo start --android # Start on Android
npx expo start --web    # Start on Web
npm run lint            # Run ESLint
npm run reset-project   # Reset to blank project
```

---

## 🔧 Customization Checklist

When starting your project, update these files:

1. **Branding** - `config/auth.config.ts`
2. **App Info** - `app.json` (name, slug, icon)
3. **Tab Screens** - `config/tabs.navigation.ts`
4. **Drawer Menu** - `config/site.navigation.ts`
5. **Theme Colors** - `constants/themes.ts`
6. **App Icon** - `assets/images/icon.png`

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) - Amazing React Native framework
- [Expo Router](https://docs.expo.dev/router/introduction/) - File-based routing
- [Ionicons](https://ionic.io/ionicons) - Beautiful icons

---

Made with ❤️ for the React Native community
