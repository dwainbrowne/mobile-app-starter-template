# Copilot Instructions - Mobile Starter Template (Expo)

A React Native starter template using Expo Router with a **configuration-driven shell architecture**.

## Architecture Overview

```
app/                 → Expo Router file-based routing (tabs layout)
components/          → Reusable UI (app-shell/, auth/, feedback/, ui/)
config/              → All customization happens here (navigation, auth, branding)
contexts/            → Global state (Theme, Auth, Settings, Drawer, QuickActions)
interfaces/          → TypeScript type definitions (always use @/interfaces)
mocks/               → Mock data for development (import from @/mocks)
services/            → Business logic (querystring, settings utilities)
constants/themes.ts  → Multi-theme system (light: grey/emerald/violet, dark: grey/forest/ocean/midnight)
```

## Key Patterns

### Configuration-Driven UI
Navigation and auth are **entirely config-driven**—modify files in `config/`, not component code:
- `tabs.navigation.ts` → Bottom tab items (must match files in `app/(tabs)/`)
- `site.navigation.ts` → Drawer menu items
- `quickactions.navigation.ts` → FAB menu items
- `auth.config.ts` → Auth type ('standard' | 'otp'), branding, social providers

### Context Usage
Always use hooks from contexts, never access context directly:
```tsx
import { useTheme, useThemeColors } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';

const { colors, isDark, mode, style } = useTheme();
const { isAuthenticated, signIn, signOut } = useAuth();
```

### Theming
Colors come from `useTheme()` or `useThemeColors()`—never hardcode colors:
```tsx
const colors = useThemeColors();
<View style={{ backgroundColor: colors.surface }}>
  <Text style={{ color: colors.text }}>...</Text>
</View>
```

Brand colors: primary (#6366F1 indigo), accent (#F97316 orange), secondary (#3B82F6 blue).

### Component Patterns
- Use `<Card>`, `<Modal>` from `@/components/ui`
- Use `<ThemedView variant="surface">` for themed containers
- Icons: Ionicons names (e.g., 'pie-chart', 'settings')—see https://ionic.io/ionicons

### Adding New Features

**New Tab Screen:**
1. Create `app/(tabs)/[name].tsx`
2. Add to `config/tabs.navigation.ts`
3. Register in `app/(tabs)/_layout.tsx` `<Tabs.Screen name="[name]" />`

**New Drawer Item:**
Add to `config/site.navigation.ts` with `route`, `url`, or `action`.

**New Mock Data:**
Create in `mocks/`, add helper functions, export from `mocks/index.ts`.

## Commands
```bash
npx expo start         # Start dev server (press i/a/w for iOS/Android/Web)
npm run lint           # ESLint check
npm run reset-project  # Move starter code to app-example/
```

## Import Aliases
Always use `@/` path alias:
```tsx
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/ui';
import type { TabItem } from '@/interfaces';
```

## File Conventions
- Interfaces: Define in `interfaces/[domain].ts`, export via `interfaces/index.ts`
- Contexts: Export provider + hook, hook throws if used outside provider
- Components: Use barrel exports (`index.ts`) for component folders
- Config persistence: Use `@react-native-async-storage/async-storage` with `@app/` key prefix
