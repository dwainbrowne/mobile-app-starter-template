/**
 * AUTH CONFIG
 *
 * Central configuration for authentication system.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * AUTHENTICATION TYPES
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * This app supports TWO independent authentication systems that can be switched
 * via the `authType` setting:
 *
 * 1. STANDARD AUTH (`authType: 'standard'`)
 *    - Email/password login with optional signup
 *    - Social login (Google, Apple, Facebook, etc.)
 *    - Forgot password flow
 *    - Best for: Consumer apps, traditional web/mobile apps
 *
 * 2. OTP AUTH (`authType: 'otp'`)
 *    - Phone number or email verification
 *    - One-time password via SMS or email
 *    - Magic link authentication
 *    - Best for: Mobile-first apps, high-security apps, simple onboarding
 *
 * To switch between systems, simply change `authType` to 'standard' or 'otp'.
 * The app will automatically render the appropriate login screens.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * BRANDING
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Configure your app's branding in the `branding` section:
 * - appName: Display name shown on login screens
 * - tagline: Subtitle/description below the app name
 * - logoSource: Import your logo image (e.g., require('@/assets/images/logo.png'))
 * - iconSource: Smaller icon for compact displays
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * VERSION INFO
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Version and build information displayed on login screen and drawer:
 * - version: Semantic version (e.g., '1.0.0')
 * - buildNumber: Build identifier (e.g., '79')
 * - buildDate: Optional build date
 *
 */

import type {
    AuthConfig,
    AuthType,
    BrandingConfig,
    LegalLinksConfig,
    OTPAuthConfig,
    SocialProviderConfig,
    StandardAuthConfig,
    VersionInfo,
} from '@/interfaces/auth';

// ===========================================
// AUTH TYPE SELECTION
// ===========================================
/**
 * Switch between authentication systems:
 * - 'standard': Email/password + social login
 * - 'otp': Phone/email OTP + magic links
 */
export const AUTH_TYPE: AuthType = 'standard';

// ===========================================
// BRANDING CONFIGURATION
// ===========================================
export const brandingConfig: BrandingConfig = {
  appName: 'Mobile Starter',
  tagline: 'Your app, your way',
  // Uncomment and add your logo images:
  // logoSource: require('@/assets/images/logo.png'),
  // iconSource: require('@/assets/images/icon.png'),
  showAppNameWithLogo: true,
  companyName: 'Your Company',
  copyrightText: '© 2026 Your Company. All rights reserved.',
};

// ===========================================
// VERSION INFORMATION
// ===========================================
export const versionInfo: VersionInfo = {
  version: '1.0.0',
  buildNumber: '1',
  buildDate: '1/18/2026',
};

// ===========================================
// LEGAL LINKS
// ===========================================
export const legalLinksConfig: LegalLinksConfig = {
  termsOfService: 'https://example.com/terms',
  privacyPolicy: 'https://example.com/privacy',
  cookiePolicy: 'https://example.com/cookies',
  help: 'https://example.com/help',
};

// ===========================================
// SOCIAL PROVIDERS
// ===========================================
/**
 * Configure social login providers.
 * Set `enabled: true` to show the button, `comingSoon: true` to show a badge.
 *
 * Provider options: 'google' | 'apple' | 'facebook' | 'twitter' | 'github'
 */
export const socialProvidersConfig: SocialProviderConfig[] = [
  {
    provider: 'google',
    enabled: true,
    clientId: '', // Add your Google OAuth client ID
    label: 'Continue with Google',
    comingSoon: false,
  },
  {
    provider: 'apple',
    enabled: true,
    clientId: '', // Add your Apple Sign In client ID
    label: 'Continue with Apple',
    comingSoon: true, // Show "Coming Soon" badge
  },
  {
    provider: 'facebook',
    enabled: false,
    clientId: '',
    label: 'Continue with Facebook',
    comingSoon: false,
  },
  {
    provider: 'github',
    enabled: false,
    clientId: '',
    label: 'Continue with GitHub',
    comingSoon: false,
  },
];

// ===========================================
// STANDARD AUTH SETTINGS
// ===========================================
export const standardAuthConfig: StandardAuthConfig = {
  enableEmailPassword: true,
  enableSignup: true,
  enableForgotPassword: true,
  enableRememberMe: true,
  socialProviders: socialProvidersConfig,
  minPasswordLength: 8,
  requireEmailVerification: false,
};

// ===========================================
// OTP AUTH SETTINGS
// ===========================================
export const otpAuthConfig: OTPAuthConfig = {
  /**
   * OTP delivery method:
   * - 'sms': Phone number only
   * - 'email': Email only
   * - 'both': User can choose phone or email
   */
  deliveryMethod: 'sms',
  
  /** Number of digits in OTP code (4-6 recommended) */
  codeLength: 6,
  
  /** How long the OTP is valid (in seconds) */
  expirationSeconds: 300, // 5 minutes
  
  /** Minimum time between resend requests (in seconds) */
  resendCooldownSeconds: 60,
  
  /** Maximum number of resend attempts */
  maxResendAttempts: 3,
  
  /** Enable magic link as alternative to OTP code */
  enableMagicLink: true,
  
  /** Default country code for phone input */
  defaultCountryCode: '+1',
};

// ===========================================
// COMPLETE AUTH CONFIG
// ===========================================
export const authConfig: AuthConfig = {
  authType: AUTH_TYPE,
  standard: standardAuthConfig,
  otp: otpAuthConfig,
  legal: legalLinksConfig,
  branding: brandingConfig,
  versionInfo: versionInfo,
};

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Get enabled social providers
 */
export function getEnabledSocialProviders(): SocialProviderConfig[] {
  return socialProvidersConfig.filter((p) => p.enabled);
}

/**
 * Check if standard auth is active
 */
export function isStandardAuth(): boolean {
  return AUTH_TYPE === 'standard';
}

/**
 * Check if OTP auth is active
 */
export function isOTPAuth(): boolean {
  return AUTH_TYPE === 'otp';
}

/**
 * Get formatted version string (e.g., 'v1.0.0 (Build 79)')
 */
export function getFormattedVersion(): string {
  const { version, buildNumber } = versionInfo;
  return `v${version}${buildNumber ? ` (Build ${buildNumber})` : ''}`;
}

/**
 * Get full version string with date (e.g., 'v1.0.0 Build 79 (1/18/2026)')
 */
export function getFullVersionString(): string {
  const { version, buildNumber, buildDate } = versionInfo;
  let str = `v${version}`;
  if (buildNumber) str += `\nBuild ${buildNumber}`;
  if (buildDate) str += ` (${buildDate})`;
  return str;
}

export default authConfig;
