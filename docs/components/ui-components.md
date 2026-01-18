# UI Components

Reusable UI components for consistent styling across the app.

---

## Components Overview

```
components/ui/
├── Card.tsx               # Card container with optional title
├── Modal.tsx              # Reusable modal dialog
├── collapsible.tsx        # Expandable/collapsible section
├── icon-symbol.tsx        # Platform-specific icons
└── index.ts               # Barrel export
```

---

## Card

A styled card container with optional header.

### Import
```tsx
import { Card, CardSection } from '@/components/ui';
```

### Basic Usage
```tsx
<Card>
  <Text>Card content</Text>
</Card>
```

### With Title and Subtitle
```tsx
<Card title="User Profile" subtitle="Your account details">
  <ProfileContent />
</Card>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | required | Card content |
| `title` | string | - | Card header title |
| `subtitle` | string | - | Card header subtitle |
| `style` | ViewStyle | - | Custom container style |
| `padding` | `'none' \| 'small' \| 'medium' \| 'large'` | `'medium'` | Inner padding |
| `elevated` | boolean | false | Add shadow effect |

### Padding Values
- `none`: 0px
- `small`: 12px
- `medium`: 16px
- `large`: 20px

### Examples

**Elevated Card:**
```tsx
<Card elevated>
  <Text>Elevated card with shadow</Text>
</Card>
```

**Custom Padding:**
```tsx
<Card padding="large">
  <Text>Large padding</Text>
</Card>
```

**With Custom Style:**
```tsx
<Card style={{ marginBottom: 20 }}>
  <Text>Custom margin</Text>
</Card>
```

---

## CardSection

A section header for grouping multiple cards.

### Usage
```tsx
<CardSection title="Account">
  <Card>...</Card>
  <Card>...</Card>
</CardSection>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | required | Section title |
| `children` | ReactNode | required | Cards in section |
| `style` | ViewStyle | - | Custom container style |

### Example
```tsx
<CardSection title="APPEARANCE">
  <Card>
    <SettingRow title="Dark Mode" />
  </Card>
</CardSection>

<CardSection title="NOTIFICATIONS">
  <Card>
    <SettingRow title="Push Notifications" />
    <SettingRow title="Email Alerts" />
  </Card>
</CardSection>
```

---

## Modal

A reusable modal dialog component.

### Import
```tsx
import { Modal } from '@/components/ui';
```

### Basic Usage
```tsx
const [visible, setVisible] = useState(false);

<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  title="Confirm Action"
>
  <Text>Are you sure?</Text>
  <Button title="Confirm" onPress={handleConfirm} />
</Modal>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | boolean | required | Show/hide modal |
| `onClose` | function | required | Close handler |
| `title` | string | - | Modal header title |
| `children` | ReactNode | required | Modal content |
| `animationType` | `'none' \| 'slide' \| 'fade'` | `'fade'` | Animation type |

### With Header
```tsx
<Modal
  visible={visible}
  onClose={handleClose}
  title="Select Category"
>
  <CategoryList />
</Modal>
```

---

## Collapsible

An expandable/collapsible content section.

### Import
```tsx
import { Collapsible } from '@/components/ui';
```

### Usage
```tsx
<Collapsible title="Advanced Options">
  <Text>Hidden content that expands when tapped</Text>
</Collapsible>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | required | Header title |
| `children` | ReactNode | required | Collapsible content |
| `defaultOpen` | boolean | false | Initial expanded state |

---

## IconSymbol

Platform-specific icon rendering (SF Symbols on iOS, fallback on Android).

### Import
```tsx
import { IconSymbol } from '@/components/ui';
```

### Usage
```tsx
<IconSymbol name="star.fill" size={24} color={colors.primary} />
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | required | SF Symbol name |
| `size` | number | 24 | Icon size |
| `color` | string | - | Icon color |

### Note
For cross-platform consistency, prefer using Ionicons directly:
```tsx
import { Ionicons } from '@expo/vector-icons';

<Ionicons name="star" size={24} color={colors.primary} />
```

---

## Theming Components

All UI components automatically use theme colors:

```tsx
// Card.tsx (internal)
const { colors } = useTheme();

<View style={{ backgroundColor: colors.surface }}>
  <Text style={{ color: colors.text }}>{title}</Text>
</View>
```

### Using Theme in Your Components
```tsx
import { useThemeColors } from '@/contexts/ThemeContext';

function MyComponent() {
  const colors = useThemeColors();
  
  return (
    <Card>
      <View style={{ backgroundColor: colors.primary + '15' }}>
        <Text style={{ color: colors.text }}>Themed content</Text>
      </View>
    </Card>
  );
}
```

---

## Common Patterns

### Settings Row
```tsx
function SettingRow({ icon, title, value, onValueChange }) {
  const colors = useThemeColors();
  
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={20} color={colors.primary} />
      <Text style={{ color: colors.text }}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.accent }}
      />
    </View>
  );
}
```

### List Item Card
```tsx
function ListItemCard({ title, subtitle, onPress }) {
  const colors = useThemeColors();
  
  return (
    <TouchableOpacity onPress={onPress}>
      <Card padding="small">
        <View style={styles.row}>
          <View>
            <Text style={{ color: colors.text }}>{title}</Text>
            <Text style={{ color: colors.textSecondary }}>{subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" color={colors.textSecondary} />
        </View>
      </Card>
    </TouchableOpacity>
  );
}
```

### Empty State
```tsx
function EmptyState({ icon, title, message }) {
  const colors = useThemeColors();
  
  return (
    <View style={styles.center}>
      <Ionicons name={icon} size={64} color={colors.textSecondary} />
      <Text style={{ color: colors.text }}>{title}</Text>
      <Text style={{ color: colors.textSecondary }}>{message}</Text>
    </View>
  );
}
```

---

## Best Practices

1. **Import from barrel export:**
```tsx
import { Card, Modal, Collapsible } from '@/components/ui';
```

2. **Always use theme colors:**
```tsx
const colors = useThemeColors();
// Never hardcode colors
```

3. **Consistent padding:**
Use Card's padding prop instead of custom styles when possible.

4. **Semantic elevation:**
Use `elevated` for cards that need visual prominence.

5. **Reuse patterns:**
Extract common patterns into new components when used 3+ times.

---

## Adding New Components

1. Create `components/ui/NewComponent.tsx`
2. Use theme colors via `useTheme()` or `useThemeColors()`
3. Add TypeScript props interface
4. Export from `components/ui/index.ts`
5. Document usage here
