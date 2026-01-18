/**
 * Auth Interfaces
 *
 * Type definitions for the authentication system.
 * Supports two authentication modes:
 * - Standard: Email/password with optional social login (Google, Apple)
 * - OTP: Phone/email verification with magic links
 */

/**
 * Available authentication types
 * - 'standard': Traditional email/password with social login options
 * - 'otp': One-time password via SMS/email with magic links
 */
export type AuthType = 'standard' | 'otp';

/**
 * OTP delivery method for OTP authentication
 */
export type OTPDeliveryMethod = 'sms' | 'email' | 'both';

/**
 * Social authentication providers
 */
export type SocialProvider = 'google' | 'apple' | 'facebook' | 'twitter' | 'github';

/**
 * Configuration for a social auth provider
 */
export interface SocialProviderConfig {
  /** Provider identifier */
  provider: SocialProvider;
  /** Whether this provider is enabled */
  enabled: boolean;
  /** Client ID for OAuth */
  clientId?: string;
  /** Display label override */
  label?: string;
  /** Show "Coming Soon" badge */
  comingSoon?: boolean;
}

/**
 * Standard authentication configuration
 * Email/password with optional social login
 */
export interface StandardAuthConfig {
  /** Enable email/password login */
  enableEmailPassword: boolean;
  /** Allow new user registration */
  enableSignup: boolean;
  /** Enable "Forgot Password" functionality */
  enableForgotPassword: boolean;
  /** Enable "Remember Me" checkbox */
  enableRememberMe: boolean;
  /** Social providers configuration */
  socialProviders: SocialProviderConfig[];
  /** Minimum password length */
  minPasswordLength: number;
  /** Require email verification before login */
  requireEmailVerification: boolean;
}

/**
 * OTP authentication configuration
 * Phone/email verification with magic links
 */
export interface OTPAuthConfig {
  /** OTP delivery method: SMS, email, or both */
  deliveryMethod: OTPDeliveryMethod;
  /** OTP code length (typically 4-6 digits) */
  codeLength: number;
  /** OTP expiration time in seconds */
  expirationSeconds: number;
  /** Allow resend after this many seconds */
  resendCooldownSeconds: number;
  /** Maximum resend attempts */
  maxResendAttempts: number;
  /** Enable magic link alternative */
  enableMagicLink: boolean;
  /** Default country code for phone input (e.g., '+1') */
  defaultCountryCode: string;
}

/**
 * Legal links configuration
 */
export interface LegalLinksConfig {
  /** Terms of Service URL */
  termsOfService: string;
  /** Privacy Policy URL */
  privacyPolicy: string;
  /** Cookie Policy URL (optional) */
  cookiePolicy?: string;
  /** EULA URL (optional) */
  eula?: string;
  /** Help/Support URL (optional) */
  help?: string;
}

/**
 * App branding configuration
 */
export interface BrandingConfig {
  /** App display name */
  appName: string;
  /** App tagline/description */
  tagline: string;
  /** Logo image source (local require or remote URL) */
  logoSource?: number | { uri: string };
  /** Icon image source (for smaller displays) */
  iconSource?: number | { uri: string };
  /** Whether to show app name next to logo */
  showAppNameWithLogo: boolean;
  /** Company/organization name */
  companyName?: string;
  /** Copyright text */
  copyrightText?: string;
}

/**
 * App version information
 */
export interface VersionInfo {
  /** Semantic version (e.g., '1.0.0') */
  version: string;
  /** Build number (e.g., '79') */
  buildNumber: string;
  /** Build date (optional, e.g., '1/18/2026') */
  buildDate?: string;
}

/**
 * Complete authentication configuration
 */
export interface AuthConfig {
  /**
   * Which authentication type to use
   * @see AuthType
   */
  authType: AuthType;
  
  /**
   * Standard auth configuration
   * Used when authType is 'standard'
   */
  standard: StandardAuthConfig;
  
  /**
   * OTP auth configuration
   * Used when authType is 'otp'
   */
  otp: OTPAuthConfig;
  
  /**
   * Legal links (terms, privacy, etc.)
   */
  legal: LegalLinksConfig;
  
  /**
   * App branding for auth screens
   */
  branding: BrandingConfig;
  
  /**
   * App version info
   */
  versionInfo: VersionInfo;
}

/**
 * Auth screen state
 */
export type AuthScreenState = 
  | 'login'           // Initial login screen
  | 'emailLogin'      // Email/password login form
  | 'signup'          // Registration screen
  | 'forgotPassword'  // Password reset request
  | 'resetPassword'   // Password reset form
  | 'otpEntry'        // OTP verification input
  | 'phoneEntry'      // Phone number input
  | 'emailEntry';     // Email input for OTP

/**
 * Auth context value
 */
export interface AuthContextValue {
  /** Current user info */
  user: import('./app').UserInfo | null;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Authentication type being used */
  authType: AuthType;
  /** Loading state */
  isLoading: boolean;
  /** Current auth screen state */
  screenState: AuthScreenState;
  /** Sign in with email/password */
  signInWithEmail: (email: string, password: string) => Promise<void>;
  /** Sign up with email/password */
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  /** Sign in with social provider */
  signInWithSocial: (provider: SocialProvider) => Promise<void>;
  /** Request OTP */
  requestOTP: (identifier: string, method: OTPDeliveryMethod) => Promise<void>;
  /** Verify OTP */
  verifyOTP: (code: string) => Promise<void>;
  /** Request magic link */
  requestMagicLink: (email: string) => Promise<void>;
  /** Sign out */
  signOut: () => void;
  /** Update screen state */
  setScreenState: (state: AuthScreenState) => void;
  /** Reset password */
  resetPassword: (email: string) => Promise<void>;
}
