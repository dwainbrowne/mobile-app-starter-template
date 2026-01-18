# Mobile Starter Template Documentation

A comprehensive documentation for the Mobile Starter Template - a configuration-driven React Native shell architecture built with Expo Router.

## 📚 Documentation Index

### Getting Started
- [Quick Start Guide](./getting-started.md) - Set up and run the app
- [Architecture Overview](./architecture.md) - Understand the app structure

### Core Concepts
- [Configuration System](./configuration.md) - How to customize the app
- [Theming System](./theming.md) - Light/dark modes and theme styles
- [Navigation](./navigation.md) - Tabs, drawer, and routing

### Components
- [App Shell](./components/app-shell.md) - Header, Drawer, CustomTabBar
- [UI Components](./components/ui-components.md) - Card, Modal, and more
- [Auth Components](./components/auth-components.md) - Login screens

### Screens
- [Screen Overview](./screens/overview.md) - All app screens
- [Tab Screens](./screens/tabs.md) - Bottom tab navigation screens
- [Modal Screens](./screens/modals.md) - Modal and popup screens

### Authentication
- [Authentication Guide](./authentication.md) - Standard and OTP auth
- [Backend Integration](./backend-integration.md) - API and SMTP setup

### Contexts & State
- [Context Overview](./contexts.md) - Global state management
- [Theme Context](./contexts/theme-context.md) - Theme management
- [Auth Context](./contexts/auth-context.md) - User authentication

---

## Quick Reference

### Project Structure
```
app/                 → Expo Router file-based routing
components/          → Reusable UI components
config/              → App configuration (navigation, auth, branding)
contexts/            → Global state management
interfaces/          → TypeScript type definitions
mocks/               → Mock data for development
services/            → Business logic utilities
constants/           → Theme definitions
```

### Key Commands
```bash
# Start development server
npx expo start

# Run on specific platform
npx expo start --ios
npx expo start --android
npx expo start --web

# Lint code
npm run lint

# Reset project (move starter code)
npm run reset-project
```

### Configuration Quick Links
| File | Purpose |
|------|---------|
| `config/auth.config.ts` | Authentication type, branding, version |
| `config/tabs.navigation.ts` | Bottom tab bar items |
| `config/site.navigation.ts` | Side drawer menu items |
| `config/quickactions.navigation.ts` | FAB quick actions |
| `config/app.ts` | Feature flags, colors |

### Theme Options
**Light Themes:** Grey (default), Emerald, Violet
**Dark Themes:** Grey, Forest, Ocean, Midnight

---

## Contributing

When adding new features or screens:

1. Create the screen file in the appropriate location
2. Update relevant config files
3. Add TypeScript interfaces to `interfaces/`
4. Update this documentation

---

*Last updated: January 2026*
