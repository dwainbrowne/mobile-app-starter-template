/**
 * LAYOUT CONFIG
 *
 * Standardized spacing, sizing, and visual constants for consistent UI.
 * Import from '@/config' to use across all screens and components.
 */

/**
 * Spacing scale for consistent margins, padding, and gaps
 */
export const spacing = {
  /** Extra small: 4px - minimal spacing */
  xs: 4,
  /** Small: 8px - tight spacing between related items */
  sm: 8,
  /** Medium: 12px - default gap between list items */
  md: 12,
  /** Large: 16px - standard section padding */
  lg: 16,
  /** Extra large: 20px - generous spacing */
  xl: 20,
  /** 2X large: 24px - section separators */
  xxl: 24,
  /** 3X large: 32px - major section breaks */
  xxxl: 32,
} as const;

/**
 * Common layout values for screens
 */
export const layout = {
  /** Standard screen content padding */
  screenPadding: spacing.lg,
  /** Gap between list items (cards, rows) */
  listItemGap: spacing.md,
  /** Card internal padding */
  cardPadding: spacing.lg,
  /** Standard border radius for cards */
  cardRadius: 12,
  /** Larger border radius for modals and sheets */
  sheetRadius: 24,
  /** Small border radius for buttons and inputs */
  inputRadius: 12,
  /** Bottom padding to account for tab bar */
  tabBarPadding: 100,
  /** Section margin bottom */
  sectionMargin: spacing.lg,
} as const;

/**
 * Overlay and modal visual settings
 */
export const overlay = {
  /** Overlay background color (black with alpha applied separately) */
  backgroundColor: '#000000',
  /** Standard overlay opacity for dimming (matches QuickActions) */
  opacity: 0.5,
  /** Standard blur intensity for modal overlays */
  blurIntensity: 20,
  /** Blur intensity for light mode (subtle) */
  blurIntensityLight: 20,
  /** Blur intensity for dark mode (subtle) */
  blurIntensityDark: 15,
} as const;

/**
 * Animation durations in milliseconds
 */
export const animation = {
  /** Fast animations (hover, press feedback) */
  fast: 150,
  /** Normal animations (transitions) */
  normal: 200,
  /** Slow animations (page transitions) */
  slow: 300,
  /** Modal enter animation */
  modalEnter: 250,
  /** Modal exit animation */
  modalExit: 200,
} as const;

/**
 * Spring animation presets for react-native-reanimated
 */
export const springs = {
  /** Gentle spring for modals - less aggressive entrance */
  modal: {
    damping: 25,
    stiffness: 200,
  },
  /** Standard spring for UI elements */
  default: {
    damping: 20,
    stiffness: 300,
  },
  /** Bouncy spring for playful animations */
  bouncy: {
    damping: 15,
    stiffness: 400,
  },
} as const;

/**
 * Shadow presets for elevation
 */
export const shadows = {
  /** Subtle shadow for cards */
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  /** Medium shadow for floating elements */
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  /** Strong shadow for modals and sheets */
  sheet: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
  },
} as const;

// Type exports for TypeScript support
export type Spacing = typeof spacing;
export type Layout = typeof layout;
export type Overlay = typeof overlay;
export type Animation = typeof animation;
export type Springs = typeof springs;
export type Shadows = typeof shadows;
