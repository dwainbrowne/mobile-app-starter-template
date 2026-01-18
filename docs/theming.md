# Theming System

The Mobile Starter Template supports a comprehensive multi-theme system with light and dark modes, each with multiple style variations.

---

## Theme Overview

### Light Themes
| Style | Description | Primary Color |
|-------|-------------|---------------|
| **Grey** (default) | Clean, professional neutral | Indigo #6366F1 |
| **Emerald** | Fresh green, nature-inspired | Emerald #10B981 |
| **Violet** | Purple/blue gradient | Violet #8B5CF6 |

### Dark Themes
| Style | Description | Background |
|-------|-------------|------------|
| **Grey** (default) | Classic neutral dark | Slate #0F172A |
| **Forest** | Nature-inspired green | Deep green #0D1912 |
| **Ocean** | Deep blue oceanic | Navy #0A1628 |
| **Midnight** | Pure black OLED-friendly | Black #000000 |

### Theme Mapping
When switching between light/dark modes:
- Emerald (light) ↔ Forest (dark)
- Violet (light) ↔ Midnight (dark)
- Grey (light) ↔ Grey (dark)

---

## Configuration

### Default Theme
Set in `constants/themes.ts`:

```typescript
export const defaultThemeConfig = {
  mode: 'light' as const,        // 'light' or 'dark'
  style: 'grey' as ThemeStyle,   // Theme style
};
```

### Theme Persistence
Themes are automatically saved to AsyncStorage with key `@app/theme`.

---

## Using Themes in Components

### Getting Theme Colors
```tsx
import { useTheme, useThemeColors } from '@/contexts/ThemeContext';

function MyComponent() {
  // Full theme context
  const { colors, isDark, mode, style, toggleMode, setStyle } = useTheme();
  
  // Or just colors (convenience hook)
  const colors = useThemeColors();
  
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Hello</Text>
    </View>
  );
}
```

### Checking Dark Mode
```tsx
import { useIsDark } from '@/contexts/ThemeContext';

function MyComponent() {
  const isDark = useIsDark();
  
  return isDark ? <DarkContent /> : <LightContent />;
}
```

### Changing Themes
```tsx
const { toggleMode, setMode, setStyle } = useTheme();

// Toggle light/dark
toggleMode();

// Set specific mode
setMode('dark');

// Set theme style
setStyle('forest');
```

---

## Color Palette Reference

### Brand Colors (Shared)
```typescript
const brandColors = {
  primary: '#6366F1',      // Indigo - main brand
  primaryLight: '#818CF8', // Lighter indigo
  primaryDark: '#4F46E5',  // Darker indigo
  secondary: '#3B82F6',    // Blue
  accent: '#F97316',       // Orange - CTAs
  danger: '#EF4444',       // Red - destructive
  success: '#10B981',      // Emerald - success
  warning: '#F59E0B',      // Amber - warnings
  info: '#06B6D4',         // Cyan - info
};
```

### Background Colors
| Property | Light (Grey) | Dark (Grey) | Description |
|----------|-------------|-------------|-------------|
| `background` | #FFFFFF | #0F172A | Main background |
| `backgroundSecondary` | #F8FAFC | #1E293B | Secondary areas |
| `surface` | #F1F5F9 | #1E293B | Card backgrounds |
| `surfaceElevated` | #FFFFFF | #334155 | Elevated cards |

### Text Colors
| Property | Light | Dark | Description |
|----------|-------|------|-------------|
| `text` | #1E293B | #F1F5F9 | Primary text |
| `textSecondary` | #64748B | #94A3B8 | Secondary text |
| `textMuted` | #94A3B8 | #64748B | Muted text |
| `textInverse` | #FFFFFF | #0F172A | Inverse text |

### UI Colors
| Property | Description |
|----------|-------------|
| `border` | Border color |
| `borderLight` | Light border |
| `divider` | Divider lines |
| `overlay` | Modal overlays |
| `ripple` | Ripple effects |
| `highlight` | Highlighted areas |
| `disabled` | Disabled elements |

### Navigation Colors
| Property | Description |
|----------|-------------|
| `tabIconDefault` | Unselected tab icons |
| `tabIconSelected` | Selected tab icons |
| `tint` | Primary tint color |

---

## Light Mode Card Backgrounds

In light themes, cards use a subtle gray-blue background for visual separation:

```typescript
// Grey Light Theme
surface: '#F1F5F9',  // Slate-100

// Emerald Light Theme  
surface: '#ECFDF5',  // Emerald-50 lighter

// Violet Light Theme
surface: '#FAF5FF',  // Purple-50
```

This ensures white cards have clear separation from the surface background.

---

## Theme Definitions

### Full Theme Interface
```typescript
interface ThemeDefinition {
  id: ThemeStyle;
  name: string;
  description: string;
  isDark: boolean;
  palette: ThemePalette;
}

interface ThemePalette {
  // Brand
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  
  // Semantic
  danger: string;
  success: string;
  warning: string;
  info: string;
  
  // Backgrounds
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceElevated: string;
  
  // Text
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  
  // UI
  border: string;
  borderLight: string;
  divider: string;
  overlay: string;
  ripple: string;
  highlight: string;
  disabled: string;
  
  // Navigation
  tabIconDefault: string;
  tabIconSelected: string;
  tint: string;
}

type ThemeMode = 'light' | 'dark';
type ThemeStyle = 'grey' | 'emerald' | 'violet' | 'forest' | 'ocean' | 'midnight';
```

---

## Helper Functions

### Get Theme by Mode and Style
```typescript
import { getTheme } from '@/constants/themes';

const theme = getTheme(isDark, 'forest');
```

### Get Available Theme Options
```typescript
import { 
  getLightThemeOptions, 
  getDarkThemeOptions,
  getThemeOptionsForMode 
} from '@/constants/themes';

// Get all light themes
const lightThemes = getLightThemeOptions();

// Get all dark themes
const darkThemes = getDarkThemeOptions();

// Get themes for current mode
const availableThemes = getThemeOptionsForMode(isDark);
```

---

## Theme Context API

```typescript
interface ThemeContextValue {
  mode: ThemeMode;           // Current mode
  style: ThemeStyle;         // Current style
  isDark: boolean;           // Is dark mode active
  colors: ThemePalette;      // Current color palette
  theme: ThemeDefinition;    // Full theme definition
  setMode: (mode: ThemeMode) => void;
  setStyle: (style: ThemeStyle) => void;
  toggleMode: () => void;
  getAvailableStyles: () => ThemeDefinition[];
}
```

---

## Settings UI Integration

The Settings screen includes a theme picker:

```tsx
// Toggle dark mode
<Switch
  value={isDark}
  onValueChange={toggleMode}
/>

// Theme style selector (dark mode only)
{isDark && darkThemeOptions.map((theme) => (
  <TouchableOpacity
    key={theme.id}
    onPress={() => setStyle(theme.id)}
  >
    <View style={{ backgroundColor: themePreviewColors[theme.id] }}>
      {style === theme.id && <Checkmark />}
    </View>
  </TouchableOpacity>
))}
```

---

## Best Practices

### Do's ✅
- Always use `useThemeColors()` for colors
- Use semantic color names (`colors.primary`, `colors.danger`)
- Test both light and dark modes
- Use `colors.surface` for card backgrounds
- Use `colors.background` for main backgrounds

### Don'ts ❌
- Never hardcode color values
- Don't use `Platform.select` for colors
- Avoid opacity on backgrounds (use theme colors)
- Don't mix theme colors with hardcoded values

### Example Component
```tsx
function GoodComponent() {
  const colors = useThemeColors();
  
  return (
    <View style={{ backgroundColor: colors.surface }}>
      <Text style={{ color: colors.text }}>Title</Text>
      <Text style={{ color: colors.textSecondary }}>Subtitle</Text>
      <TouchableOpacity style={{ backgroundColor: colors.primary }}>
        <Text style={{ color: colors.textInverse }}>Button</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## Adding a New Theme

1. Define theme in `constants/themes.ts`:
```typescript
export const newDarkTheme: ThemeDefinition = {
  id: 'newtheme',
  name: 'New Theme',
  description: 'Description',
  isDark: true,
  palette: {
    ...brandColors,
    // Override colors as needed
  },
};
```

2. Add to theme registry:
```typescript
export const darkThemes: Record<ThemeStyle, ThemeDefinition> = {
  // ... existing themes
  newtheme: newDarkTheme,
};
```

3. Update TypeScript types in `interfaces/theme.ts`:
```typescript
type ThemeStyle = 'grey' | 'emerald' | 'violet' | 'forest' | 'ocean' | 'midnight' | 'newtheme';
```

4. Add to Settings UI theme picker.
