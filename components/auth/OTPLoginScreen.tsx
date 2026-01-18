/**
 * OTP Auth Login Screen
 *
 * Phone/email verification with OTP codes and magic links.
 * Features:
 * - Phone/Email toggle tabs
 * - Country code picker with flags
 * - Auto-formatted phone numbers
 * - OTP code verification
 * - Magic link requests
 */

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { authConfig, getFormattedVersion } from '@/config/auth.config';
import { useThemeColors } from '@/contexts/ThemeContext';
import type { AuthScreenState, OTPDeliveryMethod } from '@/interfaces/auth';

// ===========================================
// COUNTRY DATA WITH FLAGS
// ===========================================
interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹' },
  { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', dialCode: '+358', flag: '🇫🇮' },
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
  { code: 'PL', name: 'Poland', dialCode: '+48', flag: '🇵🇱' },
  { code: 'CZ', name: 'Czech Republic', dialCode: '+420', flag: '🇨🇿' },
  { code: 'GR', name: 'Greece', dialCode: '+30', flag: '🇬🇷' },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'HK', name: 'Hong Kong', dialCode: '+852', flag: '🇭🇰' },
  { code: 'TW', name: 'Taiwan', dialCode: '+886', flag: '🇹🇼' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { code: 'IL', name: 'Israel', dialCode: '+972', flag: '🇮🇱' },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱' },
  { code: 'PE', name: 'Peru', dialCode: '+51', flag: '🇵🇪' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿' },
  { code: 'JM', name: 'Jamaica', dialCode: '+1', flag: '🇯🇲' },
  { code: 'TT', name: 'Trinidad and Tobago', dialCode: '+1', flag: '🇹🇹' },
  { code: 'BB', name: 'Barbados', dialCode: '+1', flag: '🇧🇧' },
];

// ===========================================
// COMPONENT
// ===========================================
interface OTPLoginScreenProps {
  onRequestOTP?: (identifier: string, method: OTPDeliveryMethod) => Promise<void>;
  onVerifyOTP?: (code: string) => Promise<void>;
  onRequestMagicLink?: (email: string) => Promise<void>;
}

export default function OTPLoginScreen({
  onRequestOTP,
  onVerifyOTP,
  onRequestMagicLink,
}: OTPLoginScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { otp, branding, legal } = authConfig;

  // State
  const [screenState, setScreenState] = useState<AuthScreenState>('phoneEntry');
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>(
    otp.deliveryMethod === 'email' ? 'email' : 'phone'
  );
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    COUNTRIES.find((c) => c.dialCode === otp.defaultCountryCode) || COUNTRIES[0]
  );
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [otpCode, setOtpCode] = useState<string[]>(Array(otp.codeLength).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [currentIdentifier, setCurrentIdentifier] = useState('');
  const [currentMethod, setCurrentMethod] = useState<OTPDeliveryMethod>('sms');

  const otpInputRefs = useRef<(TextInput | null)[]>([]);
  const phoneInputRef = useRef<TextInput>(null);

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!countrySearch) return COUNTRIES;
    const search = countrySearch.toLowerCase();
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.dialCode.includes(search) ||
        c.code.toLowerCase().includes(search)
    );
  }, [countrySearch]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-focus first OTP input when entering OTP screen
  useEffect(() => {
    if (screenState === 'otpEntry' && otpInputRefs.current[0]) {
      setTimeout(() => otpInputRefs.current[0]?.focus(), 300);
    }
  }, [screenState]);

  // Auto-format phone number
  const formatPhoneInput = useCallback((text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    setPhoneNumber(cleaned);

    // Format for display: (XXX) XXX-XXXX
    let formatted = '';
    if (cleaned.length > 0) {
      if (cleaned.length <= 3) {
        formatted = `(${cleaned}`;
      } else if (cleaned.length <= 6) {
        formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
      } else {
        formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
      }
    }
    setFormattedPhone(formatted);
  }, []);

  // Format phone for display with country code
  const getFullPhoneDisplay = useCallback((): string => {
    if (!phoneNumber) return '';
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      return `${selectedCountry.dialCode} (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
    return `${selectedCountry.dialCode} ${formattedPhone}`;
  }, [phoneNumber, formattedPhone, selectedCountry.dialCode]);

  const handleRequestOTP = async () => {
    const identifier = activeTab === 'phone' ? `${selectedCountry.dialCode}${phoneNumber}` : email;
    const method: OTPDeliveryMethod = activeTab === 'phone' ? 'sms' : 'email';

    if (activeTab === 'phone' && phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    if (activeTab === 'email' && !email) {
      setError('Please enter your email');
      return;
    }

    setError(null);
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await onRequestOTP?.(identifier, method);
      setCurrentIdentifier(identifier);
      setCurrentMethod(method);
      setOtpCode(Array(otp.codeLength).fill(''));
      setCountdown(otp.resendCooldownSeconds);
      setScreenState('otpEntry');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0 || resendAttempts >= otp.maxResendAttempts) return;

    setError(null);
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await onRequestOTP?.(currentIdentifier, currentMethod);
      setResendAttempts((prev) => prev + 1);
      setCountdown(otp.resendCooldownSeconds);
    } catch (err: any) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const code = otpCode.join('');
    if (code.length !== otp.codeLength) {
      setError(`Please enter the ${otp.codeLength}-digit code`);
      return;
    }

    setError(null);
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await onVerifyOTP?.(code);
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
      setOtpCode(Array(otp.codeLength).fill(''));
      otpInputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setError(null);
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await onRequestMagicLink?.(email);
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const chars = value.replace(/\D/g, '').slice(0, otp.codeLength).split('');
      const newCode = [...otpCode];
      chars.forEach((char, i) => {
        if (index + i < otp.codeLength) {
          newCode[index + i] = char;
        }
      });
      setOtpCode(newCode);

      const nextIndex = Math.min(index + chars.length, otp.codeLength - 1);
      otpInputRefs.current[nextIndex]?.focus();
    } else {
      const newCode = [...otpCode];
      newCode[index] = value.replace(/\D/g, '');
      setOtpCode(newCode);

      if (value && index < otp.codeLength - 1) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOTPKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const openLink = async (url: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await WebBrowser.openBrowserAsync(url);
  };

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    setShowCountryPicker(false);
    setCountrySearch('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Focus phone input after selection
    setTimeout(() => phoneInputRef.current?.focus(), 100);
  };

  // ===========================================
  // RENDER: Country Picker Modal
  // ===========================================
  const renderCountryPicker = () => (
    <Modal
      visible={showCountryPicker}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowCountryPicker(false)}
    >
      <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Select Country</Text>
          <TouchableOpacity
            onPress={() => {
              setShowCountryPicker(false);
              setCountrySearch('');
            }}
            style={styles.modalCloseButton}
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search country or code..."
            placeholderTextColor={colors.textMuted}
            value={countrySearch}
            onChangeText={setCountrySearch}
            autoFocus
          />
          {countrySearch.length > 0 && (
            <TouchableOpacity onPress={() => setCountrySearch('')}>
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Country List */}
        <FlatList
          data={filteredCountries}
          keyExtractor={(item) => `${item.code}-${item.dialCode}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.countryItem,
                selectedCountry.code === item.code &&
                  selectedCountry.dialCode === item.dialCode && {
                    backgroundColor: `${colors.primary}15`,
                  },
              ]}
              onPress={() => handleSelectCountry(item)}
            >
              <Text style={styles.countryFlag}>{item.flag}</Text>
              <View style={styles.countryInfo}>
                <Text style={[styles.countryName, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.countryDialCode, { color: colors.textSecondary }]}>
                  {item.dialCode}
                </Text>
              </View>
              {selectedCountry.code === item.code &&
                selectedCountry.dialCode === item.dialCode && (
                  <Ionicons name="checkmark" size={22} color={colors.primary} />
                )}
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => (
            <View style={[styles.separator, { backgroundColor: colors.border }]} />
          )}
          contentContainerStyle={styles.countryList}
        />
      </View>
    </Modal>
  );

  // ===========================================
  // RENDER: Phone/Email Toggle
  // ===========================================
  const renderToggle = () => {
    if (otp.deliveryMethod !== 'both') return null;

    return (
      <View style={[styles.toggleContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === 'phone' && [styles.toggleButtonActive, { backgroundColor: colors.background }],
          ]}
          onPress={() => {
            setActiveTab('phone');
            setError(null);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Ionicons
            name="call-outline"
            size={18}
            color={activeTab === 'phone' ? colors.primary : colors.textSecondary}
            style={styles.toggleIcon}
          />
          <Text
            style={[
              styles.toggleText,
              { color: activeTab === 'phone' ? colors.primary : colors.textSecondary },
            ]}
          >
            Phone
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === 'email' && [styles.toggleButtonActive, { backgroundColor: colors.background }],
          ]}
          onPress={() => {
            setActiveTab('email');
            setError(null);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Ionicons
            name="mail-outline"
            size={18}
            color={activeTab === 'email' ? colors.primary : colors.textSecondary}
            style={styles.toggleIcon}
          />
          <Text
            style={[
              styles.toggleText,
              { color: activeTab === 'email' ? colors.primary : colors.textSecondary },
            ]}
          >
            Email
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // ===========================================
  // RENDER: Phone Entry
  // ===========================================
  const renderPhoneEntry = () => (
    <>
      <View style={styles.inputContainer}>
        <View style={styles.labelRow}>
          <Ionicons name="call-outline" size={18} color={colors.primary} />
          <Text style={[styles.inputLabel, { color: colors.text }]}>Your Phone Number</Text>
        </View>

        <View style={styles.phoneInputRow}>
          {/* Country Code Picker */}
          <TouchableOpacity
            style={[styles.countryPicker, { borderColor: colors.border, backgroundColor: colors.surface }]}
            onPress={() => setShowCountryPicker(true)}
          >
            <Text style={styles.countryPickerFlag}>{selectedCountry.flag}</Text>
            <Text style={[styles.countryPickerCode, { color: colors.text }]}>
              {selectedCountry.dialCode}
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Phone Number Input */}
          <View style={[styles.phoneInput, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <TextInput
              ref={phoneInputRef}
              style={[styles.phoneInputText, { color: colors.text }]}
              placeholder="(555) 123-4567"
              placeholderTextColor={colors.textMuted}
              value={formattedPhone}
              onChangeText={formatPhoneInput}
              keyboardType="phone-pad"
              maxLength={14}
            />
            <TouchableOpacity
              style={[styles.smsIcon, { backgroundColor: colors.primary }]}
              onPress={() => phoneInputRef.current?.focus()}
            >
              <Ionicons name="chatbubble" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Help Text */}
        <View style={styles.helpTextRow}>
          <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
          <Text style={[styles.helpText, { color: colors.textMuted }]}>
            We&apos;ll text you a {otp.codeLength}-digit code to verify it&apos;s you
          </Text>
        </View>
      </View>

      {/* Send Code Button */}
      <TouchableOpacity
        style={[
          styles.primaryButton,
          { backgroundColor: colors.primary },
          phoneNumber.length < 10 && styles.primaryButtonDisabled,
        ]}
        onPress={handleRequestOTP}
        disabled={isLoading || phoneNumber.length < 10}
      >
        <Ionicons name="chatbubble-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
        <Text style={styles.primaryButtonText}>
          {isLoading ? 'Sending...' : 'Send Me a Code'}
        </Text>
      </TouchableOpacity>
    </>
  );

  // ===========================================
  // RENDER: Email Entry
  // ===========================================
  const renderEmailEntry = () => (
    <>
      <View style={styles.inputContainer}>
        <View style={styles.labelRow}>
          <Ionicons name="mail-outline" size={18} color={colors.primary} />
          <Text style={[styles.inputLabel, { color: colors.text }]}>Your Email Address</Text>
        </View>

        <View style={[styles.emailInputWrapper, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <TextInput
            style={[styles.emailInput, { color: colors.text }]}
            placeholder="your@email.com"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Ionicons name="mail" size={20} color={colors.primary} />
        </View>

        {/* Help Text */}
        <View style={styles.helpTextRow}>
          <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
          <Text style={[styles.helpText, { color: colors.textMuted }]}>
            We&apos;ll send you a {otp.codeLength}-digit code to verify it&apos;s you
          </Text>
        </View>
      </View>

      {/* Send Code Button */}
      <TouchableOpacity
        style={[
          styles.primaryButton,
          { backgroundColor: colors.primary },
          !email && styles.primaryButtonDisabled,
        ]}
        onPress={handleRequestOTP}
        disabled={isLoading || !email}
      >
        <Ionicons name="mail-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
        <Text style={styles.primaryButtonText}>
          {isLoading ? 'Sending...' : 'Send Me a Code'}
        </Text>
      </TouchableOpacity>

      {/* Magic Link Option */}
      {otp.enableMagicLink && (
        <TouchableOpacity
          onPress={handleMagicLink}
          style={styles.magicLinkButton}
          disabled={isLoading || !email}
        >
          <Ionicons name="sparkles-outline" size={18} color={colors.primary} />
          <Text style={[styles.magicLinkText, { color: colors.primary }]}>
            Send magic link instead
          </Text>
        </TouchableOpacity>
      )}
    </>
  );

  // ===========================================
  // RENDER: OTP Entry
  // ===========================================
  const renderOTPEntry = () => (
    <>
      <Text style={[styles.title, { color: colors.text }]}>Verify Your {currentMethod === 'sms' ? 'Phone' : 'Email'}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Enter the verification code sent to
      </Text>
      <Text style={[styles.identifier, { color: colors.primary }]}>
        {currentMethod === 'sms' ? getFullPhoneDisplay() : currentIdentifier}
      </Text>

      {/* OTP Input */}
      <View style={styles.otpSection}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Verification Code</Text>
        <View style={styles.otpContainer}>
          {Array.from({ length: otp.codeLength }).map((_, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                otpInputRefs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                {
                  borderColor: otpCode[index] ? colors.primary : colors.border,
                  backgroundColor: colors.surface,
                  color: colors.text,
                },
              ]}
              value={otpCode[index]}
              onChangeText={(value) => handleOTPChange(index, value)}
              onKeyPress={({ nativeEvent }) => handleOTPKeyPress(index, nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>
        <Text style={[styles.otpHint, { color: colors.textMuted }]}>
          Enter the {otp.codeLength}-digit code sent via {currentMethod === 'sms' ? 'SMS' : 'email'}
        </Text>
      </View>

      {/* Verify Button */}
      <TouchableOpacity
        style={[
          styles.primaryButton,
          { backgroundColor: colors.primary },
          otpCode.join('').length !== otp.codeLength && styles.primaryButtonDisabled,
        ]}
        onPress={handleVerifyOTP}
        disabled={isLoading || otpCode.join('').length !== otp.codeLength}
      >
        <Text style={styles.primaryButtonText}>
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </Text>
      </TouchableOpacity>

      {/* Resend Code */}
      <TouchableOpacity
        onPress={handleResendOTP}
        style={styles.resendButton}
        disabled={countdown > 0 || resendAttempts >= otp.maxResendAttempts}
      >
        <Text
          style={[
            styles.resendText,
            {
              color:
                countdown > 0 || resendAttempts >= otp.maxResendAttempts
                  ? colors.textMuted
                  : colors.primary,
            },
          ]}
        >
          {countdown > 0
            ? `Didn't receive a code? Resend in ${countdown}s`
            : resendAttempts >= otp.maxResendAttempts
            ? 'Maximum resend attempts reached'
            : "Didn't receive a code? Resend"}
        </Text>
      </TouchableOpacity>

      {/* Change Phone/Email */}
      <TouchableOpacity
        onPress={() => {
          setScreenState(currentMethod === 'sms' ? 'phoneEntry' : 'emailEntry');
          setOtpCode(Array(otp.codeLength).fill(''));
          setResendAttempts(0);
        }}
        style={styles.backLink}
      >
        <Ionicons name="arrow-back" size={16} color={colors.primary} />
        <Text style={[styles.backLinkText, { color: colors.primary }]}>
          Use a different {currentMethod === 'sms' ? 'phone number' : 'email'}
        </Text>
      </TouchableOpacity>
    </>
  );

  // ===========================================
  // RENDER: Main Entry (Phone or Email based on toggle)
  // ===========================================
  const renderMainEntry = () => (
    <>
      {/* Welcome Header */}
      <View style={styles.welcomeHeader}>
        <Text style={styles.welcomeEmoji}>👋</Text>
        <Text style={[styles.welcomeTitle, { color: colors.text }]}>Welcome!</Text>
      </View>

      <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
        Sign in to access your {branding.appName.toLowerCase()} account.
      </Text>
      <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary, marginTop: 4 }]}>
        Pick the method that works best for you.
      </Text>

      {/* Phone/Email Toggle */}
      {renderToggle()}

      {/* Phone or Email Entry */}
      {activeTab === 'phone' ? renderPhoneEntry() : renderEmailEntry()}
    </>
  );

  // ===========================================
  // MAIN RENDER
  // ===========================================
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          {branding.iconSource ? (
            <Image source={branding.iconSource} style={styles.logo} resizeMode="contain" />
          ) : (
            <View style={[styles.logoPlaceholder, { backgroundColor: colors.primary }]}>
              <Ionicons name="wallet-outline" size={32} color="#FFFFFF" />
            </View>
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

          {screenState === 'otpEntry' ? renderOTPEntry() : renderMainEntry()}
        </View>

        {/* Legal Links */}
        <View style={styles.legalContainer}>
          <Text style={[styles.legalText, { color: colors.textMuted }]}>
            By signing in, you agree to our{' '}
            <Text style={[styles.legalLink, { color: colors.primary }]} onPress={() => openLink(legal.termsOfService)}>
              Terms of Service
            </Text>
            {' '}and{' '}
            <Text style={[styles.legalLink, { color: colors.primary }]} onPress={() => openLink(legal.privacyPolicy)}>
              Privacy Policy
            </Text>
          </Text>
        </View>

        {/* Version */}
        <Text style={[styles.versionText, { color: colors.textMuted }]}>
          {getFormattedVersion()}
        </Text>
      </ScrollView>

      {/* Country Picker Modal */}
      {renderCountryPicker()}
    </KeyboardAvoidingView>
  );
}

// ===========================================
// STYLES
// ===========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 64,
    height: 64,
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  welcomeEmoji: {
    fontSize: 28,
    marginRight: 8,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  welcomeSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  identifier: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginTop: 20,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  toggleButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleIcon: {
    marginRight: 6,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  phoneInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 6,
  },
  countryPickerFlag: {
    fontSize: 20,
  },
  countryPickerCode: {
    fontSize: 15,
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  phoneInputText: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  smsIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  emailInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
  },
  helpTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 4,
  },
  helpText: {
    fontSize: 12,
    marginLeft: 6,
    flex: 1,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  magicLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  magicLinkText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  otpSection: {
    marginBottom: 16,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 12,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  otpHint: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '500',
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  backLinkText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  legalContainer: {
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
  },
  legalText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  legalLink: {
    fontWeight: '600',
  },
  versionText: {
    fontSize: 12,
    marginTop: 16,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalCloseButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 4,
  },
  countryList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  countryFlag: {
    fontSize: 28,
    marginRight: 14,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  countryDialCode: {
    fontSize: 13,
    marginTop: 2,
  },
  separator: {
    height: 1,
    marginLeft: 56,
  },
});
