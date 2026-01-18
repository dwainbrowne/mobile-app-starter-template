# Authentication System

The Affordly App supports two independent authentication methods that can be switched via configuration:

1. **Standard Auth** - Email/password with social login
2. **OTP Auth** - Phone/email verification with magic links

---

## Quick Start

### Switching Auth Type
In `config/auth.config.ts`:

```typescript
// For email/password login
export const AUTH_TYPE: AuthType = 'standard';

// For OTP/magic link login
export const AUTH_TYPE: AuthType = 'otp';
```

The app automatically renders the appropriate login screen based on this setting.

---

## Standard Authentication

Best for consumer apps with traditional login flows.

### Features
- Email/password login
- User registration (signup)
- Forgot password flow
- Social login (Google, Apple, Facebook, GitHub)
- Remember me option

### Configuration

```typescript
// config/auth.config.ts

export const standardAuthConfig: StandardAuthConfig = {
  enableEmailPassword: true,
  enableSignup: true,
  enableForgotPassword: true,
  enableRememberMe: true,
  socialProviders: socialProvidersConfig,
  minPasswordLength: 8,
  requireEmailVerification: false,
};
```

### Social Providers

```typescript
export const socialProvidersConfig: SocialProviderConfig[] = [
  {
    provider: 'google',
    enabled: true,
    clientId: 'YOUR_GOOGLE_CLIENT_ID',
    label: 'Continue with Google',
    comingSoon: false,
  },
  {
    provider: 'apple',
    enabled: true,
    clientId: 'YOUR_APPLE_CLIENT_ID',
    label: 'Continue with Apple',
    comingSoon: true,  // Shows "Coming Soon" badge
  },
  // ... more providers
];
```

### Implementation Hooks

In `app/login.tsx`:

```typescript
const handleSignIn = async (email: string, password: string) => {
  // TODO: Call your authentication API
  // On success:
  signIn({
    name: 'User Name',
    subtitle: email,
  });
};

const handleSignUp = async (email: string, password: string, name: string) => {
  // TODO: Call your registration API
};

const handleSocialSignIn = async (provider: SocialProvider) => {
  // TODO: Implement OAuth flow for provider
};

const handleForgotPassword = async (email: string) => {
  // TODO: Send password reset email
};
```

---

## OTP Authentication

Best for mobile-first apps with simple onboarding.

### Features
- Phone number verification
- Email verification
- One-time password via SMS/email
- Magic link authentication
- Configurable code length and expiration

### Configuration

```typescript
// config/auth.config.ts

export const otpAuthConfig: OTPAuthConfig = {
  // 'sms', 'email', or 'both'
  deliveryMethod: 'sms',
  
  // Number of digits (4-6 recommended)
  codeLength: 6,
  
  // OTP validity (seconds)
  expirationSeconds: 300,  // 5 minutes
  
  // Resend cooldown (seconds)
  resendCooldownSeconds: 60,
  
  // Max resend attempts
  maxResendAttempts: 3,
  
  // Enable magic link option
  enableMagicLink: true,
  
  // Default country code
  defaultCountryCode: '+1',
};
```

### Implementation Hooks

In `app/login.tsx`:

```typescript
const handleRequestOTP = async (identifier: string, method: OTPDeliveryMethod) => {
  // TODO: Call your API to send OTP
  // identifier: phone number or email
  // method: 'sms' or 'email'
  console.log('Requesting OTP:', identifier, method);
};

const handleVerifyOTP = async (code: string) => {
  // TODO: Verify OTP with your API
  // On success:
  signIn({
    name: 'OTP User',
    subtitle: 'Verified via OTP',
  });
};

const handleRequestMagicLink = async (email: string) => {
  // TODO: Send magic link email
  console.log('Magic link for:', email);
};
```

---

## Branding Configuration

Customize the login screen appearance:

```typescript
// config/auth.config.ts

export const brandingConfig: BrandingConfig = {
  appName: 'Mobile Starter',
  tagline: 'Your app, your way',
  
  // Optional logo images
  // logoSource: require('@/assets/images/logo.png'),
  // iconSource: require('@/assets/images/icon.png'),
  
  showAppNameWithLogo: true,
  companyName: 'Your Company',
  copyrightText: '© 2026 Your Company. All rights reserved.',
};
```

### Legal Links

```typescript
export const legalLinksConfig: LegalLinksConfig = {
  termsOfService: 'https://example.com/terms',
  privacyPolicy: 'https://example.com/privacy',
  cookiePolicy: 'https://example.com/cookies',
  help: 'https://example.com/help',
};
```

---

## Version Information

Displayed on login screen and drawer footer:

```typescript
export const versionInfo: VersionInfo = {
  version: '1.0.0',
  buildNumber: '1',
  buildDate: '1/18/2026',
};
```

Helper functions:
```typescript
// "v1.0.0 (Build 1)"
getFormattedVersion();

// "v1.0.0\nBuild 1 (1/18/2026)"
getFullVersionString();
```

---

## Auth Context

The `AuthContext` provides authentication state and methods:

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { 
    user,           // Current user info or null
    isAuthenticated,// Boolean auth status
    signIn,         // Sign in user
    signOut,        // Sign out user
    updateUser,     // Update user info
  } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  return <UserContent user={user} />;
}
```

### User Info Interface

```typescript
interface UserInfo {
  name: string;
  subtitle?: string;
  email?: string;
  avatarUrl?: string;
  // Add custom fields as needed
}
```

---

## Protected Routes

Routes are automatically protected via `useProtectedRoute` in `app/_layout.tsx`:

```typescript
function useProtectedRoute(isAuthenticated: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === 'login';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments]);
}
```

---

## Backend Integration

### API Requirements

Your backend should implement:

#### Standard Auth
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/login` | POST | Email/password login |
| `/auth/register` | POST | User registration |
| `/auth/forgot-password` | POST | Send reset email |
| `/auth/reset-password` | POST | Reset password |
| `/auth/social/{provider}` | POST | Social OAuth |

#### OTP Auth
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/otp/request` | POST | Send OTP |
| `/auth/otp/verify` | POST | Verify OTP |
| `/auth/magic-link` | POST | Send magic link |
| `/auth/magic-link/verify` | GET | Verify magic link |

### SMTP Configuration (Backend)

For email-based auth, configure SMTP on your backend:

```env
# .env (backend)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM=noreply@example.com
SMTP_FROM_NAME=Mobile Starter
```

### SMS Configuration (Backend)

For SMS OTP, configure Twilio or similar:

```env
# .env (backend)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## Security Best Practices

### Client-Side
1. **Never store passwords** - Only store tokens
2. **Use secure storage** - Use `expo-secure-store` for tokens
3. **Token refresh** - Implement token refresh logic
4. **Biometric auth** - Add biometric login for returning users

### Backend
1. **Hash passwords** - Use bcrypt or argon2
2. **Rate limiting** - Limit login attempts
3. **Token expiration** - Short-lived access tokens
4. **HTTPS only** - Never send auth over HTTP

### Example Token Storage

```typescript
import * as SecureStore from 'expo-secure-store';

// Store token
await SecureStore.setItemAsync('auth_token', token);

// Retrieve token
const token = await SecureStore.getItemAsync('auth_token');

// Delete token
await SecureStore.deleteItemAsync('auth_token');
```

---

## TypeScript Interfaces

```typescript
type AuthType = 'standard' | 'otp';

type SocialProvider = 'google' | 'apple' | 'facebook' | 'twitter' | 'github';

type OTPDeliveryMethod = 'sms' | 'email';

interface StandardAuthConfig {
  enableEmailPassword: boolean;
  enableSignup: boolean;
  enableForgotPassword: boolean;
  enableRememberMe: boolean;
  socialProviders: SocialProviderConfig[];
  minPasswordLength: number;
  requireEmailVerification: boolean;
}

interface OTPAuthConfig {
  deliveryMethod: 'sms' | 'email' | 'both';
  codeLength: number;
  expirationSeconds: number;
  resendCooldownSeconds: number;
  maxResendAttempts: number;
  enableMagicLink: boolean;
  defaultCountryCode: string;
}

interface SocialProviderConfig {
  provider: SocialProvider;
  enabled: boolean;
  clientId: string;
  label: string;
  comingSoon?: boolean;
}
```

---

## Common Issues

### "Not authenticated" redirect loop
Ensure `isAuthenticated` is properly set after `signIn()`.

### Social login not working
1. Verify OAuth client IDs are correct
2. Check redirect URIs match configuration
3. Ensure expo-auth-session is configured

### OTP not receiving
1. Check SMS/email provider configuration
2. Verify phone/email format
3. Check spam folders for emails
