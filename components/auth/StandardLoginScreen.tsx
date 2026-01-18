/**
 * Standard Auth Login Screen
 *
 * Traditional email/password authentication with social login options.
 * Supports: Sign in, Sign up, Forgot password, Social providers (Google, Apple, etc.)
 */

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
    authConfig,
    getEnabledSocialProviders,
    getFormattedVersion,
} from '@/config/auth.config';
import { useThemeColors } from '@/contexts/ThemeContext';
import type { AuthScreenState, SocialProvider, SocialProviderConfig } from '@/interfaces/auth';

interface StandardLoginScreenProps {
  onSignIn?: (email: string, password: string) => Promise<void>;
  onSignUp?: (email: string, password: string, name: string) => Promise<void>;
  onSocialSignIn?: (provider: SocialProvider) => Promise<void>;
  onForgotPassword?: (email: string) => Promise<void>;
}

export default function StandardLoginScreen({
  onSignIn,
  onSignUp,
  onSocialSignIn,
  onForgotPassword,
}: StandardLoginScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { standard, branding, legal } = authConfig;
  const enabledProviders = getEnabledSocialProviders();

  const [screenState, setScreenState] = useState<AuthScreenState>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }
    setError(null);
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await onSignIn?.(email, password);
    } catch (err: any) {
      setError(err.message || 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < standard.minPasswordLength) {
      setError(`Password must be at least ${standard.minPasswordLength} characters`);
      return;
    }
    setError(null);
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await onSignUp?.(email, password, name);
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: SocialProvider) => {
    setError(null);
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await onSocialSignIn?.(provider);
    } catch (err: any) {
      setError(err.message || `${provider} sign in failed`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setError(null);
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await onForgotPassword?.(email);
      setScreenState('login');
      // Show success message
    } catch (err: any) {
      setError(err.message || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  const openLink = async (url: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await WebBrowser.openBrowserAsync(url);
  };

  const getSocialIcon = (provider: SocialProvider): keyof typeof Ionicons.glyphMap => {
    switch (provider) {
      case 'google':
        return 'logo-google';
      case 'apple':
        return 'logo-apple';
      case 'facebook':
        return 'logo-facebook';
      case 'twitter':
        return 'logo-twitter';
      case 'github':
        return 'logo-github';
      default:
        return 'log-in-outline';
    }
  };

  const renderSocialButton = (config: SocialProviderConfig) => {
    const isGoogle = config.provider === 'google';
    const isApple = config.provider === 'apple';

    return (
      <View key={config.provider} style={styles.socialButtonContainer}>
        <TouchableOpacity
          style={[
            styles.socialButton,
            isGoogle && styles.googleButton,
            isApple && [styles.appleButton, { backgroundColor: colors.textSecondary }],
            !isGoogle && !isApple && { backgroundColor: colors.surface, borderColor: colors.border },
            config.comingSoon && styles.disabledButton,
          ]}
          onPress={() => !config.comingSoon && handleSocialSignIn(config.provider)}
          disabled={config.comingSoon || isLoading}
          activeOpacity={0.8}
        >
          <Ionicons
            name={getSocialIcon(config.provider)}
            size={20}
            color={isApple ? '#FFFFFF' : isGoogle ? '#4285F4' : colors.text}
            style={styles.socialIcon}
          />
          <Text
            style={[
              styles.socialButtonText,
              isApple && styles.appleButtonText,
              !isGoogle && !isApple && { color: colors.text },
            ]}
          >
            {config.label || `Continue with ${config.provider}`}
          </Text>
        </TouchableOpacity>
        {config.comingSoon && (
          <View style={[styles.comingSoonBadge, { backgroundColor: colors.accent }]}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        )}
      </View>
    );
  };

  const renderLoginForm = () => (
    <>
      {/* Social Login Buttons */}
      {enabledProviders.length > 0 && (
        <View style={styles.socialContainer}>
          {enabledProviders.map(renderSocialButton)}
        </View>
      )}

      {/* Divider */}
      {standard.enableEmailPassword && enabledProviders.length > 0 && (
        <View style={styles.dividerContainer}>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or</Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        </View>
      )}

      {/* Email/Password Options */}
      {standard.enableEmailPassword && (
        <View style={styles.emailPasswordOptions}>
          <TouchableOpacity
            onPress={() => setScreenState('emailLogin')}
            style={styles.emailPasswordLink}
          >
            <Text style={[styles.linkText, { color: colors.primary }]}>
              Sign in with Email Password
            </Text>
          </TouchableOpacity>
          {standard.enableSignup && (
            <TouchableOpacity
              onPress={() => setScreenState('signup')}
              style={styles.emailPasswordLink}
            >
              <Text style={[styles.linkTextSecondary, { color: colors.textSecondary }]}>
                Create an account
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </>
  );

  const renderEmailLoginForm = () => (
    <>
      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Email</Text>
        <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Enter your email"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoFocus
          />
        </View>
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Password</Text>
        <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Enter your password"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Forgot Password Link */}
      {standard.enableForgotPassword && (
        <TouchableOpacity
          onPress={() => setScreenState('forgotPassword')}
          style={styles.forgotPasswordLink}
        >
          <Text style={[styles.smallLinkText, { color: colors.primary }]}>
            Forgot password?
          </Text>
        </TouchableOpacity>
      )}

      {/* Sign In Button */}
      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: colors.primary }]}
        onPress={handleSignIn}
        disabled={isLoading}
      >
        <Text style={styles.primaryButtonText}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      {standard.enableSignup && (
        <View style={styles.signupPrompt}>
          <Text style={[styles.promptText, { color: colors.textSecondary }]}>
            Don&apos;t have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => setScreenState('signup')}>
            <Text style={[styles.linkText, { color: colors.primary }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Back to Login Options */}
      <TouchableOpacity
        onPress={() => setScreenState('login')}
        style={styles.backLink}
      >
        <Ionicons name="arrow-back" size={16} color={colors.primary} />
        <Text style={[styles.linkText, { color: colors.primary, marginLeft: 4 }]}>
          Other sign in options
        </Text>
      </TouchableOpacity>
    </>
  );

  const renderSignUpForm = () => (
    <>
      {/* Name Input */}
      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Full Name</Text>
        <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Enter your name"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Email</Text>
        <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Enter your email"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Password</Text>
        <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Create a password"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Confirm Password</Text>
        <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Confirm your password"
            placeholderTextColor={colors.textMuted}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
          />
        </View>
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: colors.primary }]}
        onPress={handleSignUp}
        disabled={isLoading}
      >
        <Text style={styles.primaryButtonText}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Text>
      </TouchableOpacity>

      {/* Back to Login */}
      <TouchableOpacity
        onPress={() => setScreenState('login')}
        style={styles.backLink}
      >
        <Ionicons name="arrow-back" size={16} color={colors.primary} />
        <Text style={[styles.linkText, { color: colors.primary, marginLeft: 4 }]}>
          Back to Login
        </Text>
      </TouchableOpacity>
    </>
  );

  const renderForgotPasswordForm = () => (
    <>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Enter your email address and we&apos;ll send you a link to reset your password.
      </Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Email</Text>
        <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Enter your email"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Reset Button */}
      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: colors.primary }]}
        onPress={handleForgotPassword}
        disabled={isLoading}
      >
        <Text style={styles.primaryButtonText}>
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </Text>
      </TouchableOpacity>

      {/* Back to Login */}
      <TouchableOpacity
        onPress={() => setScreenState('login')}
        style={styles.backLink}
      >
        <Ionicons name="arrow-back" size={16} color={colors.primary} />
        <Text style={[styles.linkText, { color: colors.primary, marginLeft: 4 }]}>
          Back to Login
        </Text>
      </TouchableOpacity>
    </>
  );

  const getTitle = () => {
    switch (screenState) {
      case 'signup':
        return 'Create Account';
      case 'emailLogin':
        return 'Sign In';
      case 'forgotPassword':
        return 'Reset Password';
      default:
        return branding.appName;
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo & Branding */}
        <View style={styles.brandingContainer}>
          {branding.iconSource && (
            <Image
              source={branding.iconSource}
              style={styles.logo}
              resizeMode="contain"
            />
          )}
          {!branding.iconSource && (
            <View style={[styles.logoPlaceholder, { backgroundColor: colors.primary }]}>
              <Ionicons name="wallet-outline" size={40} color="#FFFFFF" />
            </View>
          )}
          <Text style={[styles.appName, { color: colors.text }]}>{getTitle()}</Text>
          {screenState === 'login' && (
            <Text style={[styles.tagline, { color: colors.textSecondary }]}>
              {branding.tagline}
            </Text>
          )}
        </View>

        {/* Form Card */}
        <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Error Message */}
          {error && (
            <View style={[styles.errorContainer, { backgroundColor: `${colors.danger}15` }]}>
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
            </View>
          )}

          {screenState === 'login' && renderLoginForm()}
          {screenState === 'emailLogin' && renderEmailLoginForm()}
          {screenState === 'signup' && renderSignUpForm()}
          {screenState === 'forgotPassword' && renderForgotPasswordForm()}
        </View>

        {/* Legal Links */}
        <View style={styles.legalContainer}>
          <Text style={[styles.legalText, { color: colors.textMuted }]}>
            By continuing, you agree to {branding.appName}&apos;s
          </Text>
          <View style={styles.legalLinks}>
            <TouchableOpacity onPress={() => openLink(legal.termsOfService)}>
              <Text style={[styles.legalLink, { color: colors.primary }]}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={[styles.legalText, { color: colors.textMuted }]}> & </Text>
            <TouchableOpacity onPress={() => openLink(legal.privacyPolicy)}>
              <Text style={[styles.legalLink, { color: colors.primary }]}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Version */}
        <Text style={[styles.versionText, { color: colors.textMuted }]}>
          {getFormattedVersion()}
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    alignItems: 'center',
  },
  brandingContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
  },
  formCard: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  socialContainer: {
    gap: 12,
  },
  socialButtonContainer: {
    position: 'relative',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  appleButton: {
    borderWidth: 0,
  },
  disabledButton: {
    opacity: 0.6,
  },
  socialIcon: {
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  appleButtonText: {
    color: '#FFFFFF',
  },
  comingSoonBadge: {
    position: 'absolute',
    right: -8,
    top: -8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  comingSoonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  emailPasswordLink: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  emailPasswordOptions: {
    gap: 8,
  },
  linkTextSecondary: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  smallLinkText: {
    fontSize: 13,
    fontWeight: '600',
  },
  signupPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  promptText: {
    fontSize: 14,
  },
  legalContainer: {
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
  },
  legalText: {
    fontSize: 12,
    textAlign: 'center',
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  legalLink: {
    fontSize: 12,
    fontWeight: '600',
  },
  versionText: {
    fontSize: 12,
    marginTop: 20,
  },
});
