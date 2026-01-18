import React from 'react';

import { LoginShell } from '@/components/auth';
import { useAuth } from '@/contexts/AuthContext';
import type { OTPDeliveryMethod, SocialProvider } from '@/interfaces/auth';

/**
 * Login Screen
 *
 * This screen displays the login UI and handles authentication.
 * It uses the LoginShell component which automatically selects
 * the appropriate login method based on auth.config.ts settings.
 */
export default function LoginScreen() {
  const { signIn } = useAuth();

  const handleSignIn = async (email: string, password: string) => {
    // TODO: Implement actual authentication
    // For demo purposes, just sign in with the provided email
    signIn({
      name: email.split('@')[0] || 'User',
      subtitle: email,
    });
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    // TODO: Implement actual sign up
    signIn({
      name: name,
      subtitle: email,
    });
  };

  const handleSocialSignIn = async (provider: SocialProvider) => {
    // TODO: Implement social sign in
    signIn({
      name: `${provider} User`,
      subtitle: `Signed in with ${provider}`,
    });
  };

  const handleForgotPassword = async (email: string) => {
    // TODO: Implement forgot password
    console.log('Forgot password for:', email);
  };

  // OTP auth handlers
  const handleRequestOTP = async (identifier: string, method: OTPDeliveryMethod) => {
    // TODO: Implement OTP request
    console.log('Requesting OTP:', identifier, method);
  };

  const handleVerifyOTP = async (code: string) => {
    // TODO: Implement OTP verification
    signIn({
      name: 'OTP User',
      subtitle: 'Verified via OTP',
    });
  };

  const handleRequestMagicLink = async (email: string) => {
    // TODO: Implement magic link
    console.log('Magic link for:', email);
  };

  return (
    <LoginShell
      onSignIn={handleSignIn}
      onSignUp={handleSignUp}
      onSocialSignIn={handleSocialSignIn}
      onForgotPassword={handleForgotPassword}
      onRequestOTP={handleRequestOTP}
      onVerifyOTP={handleVerifyOTP}
      onRequestMagicLink={handleRequestMagicLink}
    />
  );
}
