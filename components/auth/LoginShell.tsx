/**
 * Login Shell
 *
 * Main authentication wrapper that automatically selects the appropriate
 * login screen based on the auth configuration.
 *
 * Usage:
 * - Configure auth type in config/auth.config.ts (set authType to 'standard' or 'otp')
 * - Import and use <LoginShell /> in your app
 * - The correct login screen will be rendered automatically
 *
 * This component handles:
 * - Auth type switching based on config
 * - Passing callbacks to login screens
 * - Consistent wrapper behavior
 */

import React from 'react';

import { authConfig, isOTPAuth } from '@/config/auth.config';
import type { OTPDeliveryMethod, SocialProvider } from '@/interfaces/auth';

import OTPLoginScreen from './OTPLoginScreen';
import StandardLoginScreen from './StandardLoginScreen';

interface LoginShellProps {
  // Standard auth callbacks
  onSignIn?: (email: string, password: string) => Promise<void>;
  onSignUp?: (email: string, password: string, name: string) => Promise<void>;
  onSocialSignIn?: (provider: SocialProvider) => Promise<void>;
  onForgotPassword?: (email: string) => Promise<void>;
  
  // OTP auth callbacks
  onRequestOTP?: (identifier: string, method: OTPDeliveryMethod) => Promise<void>;
  onVerifyOTP?: (code: string) => Promise<void>;
  onRequestMagicLink?: (email: string) => Promise<void>;
}

/**
 * LoginShell Component
 *
 * Automatically renders the appropriate login screen based on the
 * `authType` setting in auth.config.ts.
 *
 * @example
 * // Standard auth (email/password + social)
 * <LoginShell
 *   onSignIn={handleSignIn}
 *   onSignUp={handleSignUp}
 *   onSocialSignIn={handleSocialSignIn}
 *   onForgotPassword={handleForgotPassword}
 * />
 *
 * @example
 * // OTP auth (phone/email verification)
 * <LoginShell
 *   onRequestOTP={handleRequestOTP}
 *   onVerifyOTP={handleVerifyOTP}
 *   onRequestMagicLink={handleMagicLink}
 * />
 */
export default function LoginShell({
  // Standard auth
  onSignIn,
  onSignUp,
  onSocialSignIn,
  onForgotPassword,
  // OTP auth
  onRequestOTP,
  onVerifyOTP,
  onRequestMagicLink,
}: LoginShellProps) {
  // Render based on configured auth type
  if (isOTPAuth()) {
    return (
      <OTPLoginScreen
        onRequestOTP={onRequestOTP}
        onVerifyOTP={onVerifyOTP}
        onRequestMagicLink={onRequestMagicLink}
      />
    );
  }

  // Default to standard auth
  return (
    <StandardLoginScreen
      onSignIn={onSignIn}
      onSignUp={onSignUp}
      onSocialSignIn={onSocialSignIn}
      onForgotPassword={onForgotPassword}
    />
  );
}

/**
 * Export the current auth type for external use
 */
export const currentAuthType = authConfig.authType;
