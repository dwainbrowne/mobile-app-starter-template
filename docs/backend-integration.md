# Backend Integration Guide

This guide covers how to integrate the Mobile Starter Template with your backend services, including authentication, SMTP, and API setup.

---

## Overview

The Mobile Starter Template is designed as a frontend shell. You need to implement:

1. **Authentication API** - User login, registration, tokens
2. **SMTP Service** - Email delivery for OTP, magic links, notifications
3. **SMS Service** - SMS delivery for OTP (optional)
4. **Data API** - Transactions, receipts, user data

---

## Authentication Backend

### API Endpoints Required

#### Standard Auth
| Endpoint | Method | Body | Response |
|----------|--------|------|----------|
| `/auth/login` | POST | `{email, password}` | `{user, token}` |
| `/auth/register` | POST | `{email, password, name}` | `{user, token}` |
| `/auth/forgot-password` | POST | `{email}` | `{message}` |
| `/auth/reset-password` | POST | `{token, password}` | `{message}` |
| `/auth/social/{provider}` | POST | `{accessToken}` | `{user, token}` |
| `/auth/refresh` | POST | `{refreshToken}` | `{token}` |
| `/auth/logout` | POST | - | `{message}` |

#### OTP Auth
| Endpoint | Method | Body | Response |
|----------|--------|------|----------|
| `/auth/otp/request` | POST | `{identifier, method}` | `{message, expiresAt}` |
| `/auth/otp/verify` | POST | `{identifier, code}` | `{user, token}` |
| `/auth/magic-link` | POST | `{email}` | `{message}` |
| `/auth/magic-link/verify` | GET | `?token=xxx` | Redirect or `{user, token}` |

### Response Format

```typescript
// Success response
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "refresh_token_here"
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

### Implementing in the App

Edit `app/login.tsx` to call your API:

```typescript
const handleSignIn = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Store token securely
      await SecureStore.setItemAsync('auth_token', data.data.token);
      
      // Sign in user
      signIn({
        name: data.data.user.name,
        subtitle: data.data.user.email,
      });
    } else {
      Alert.alert('Error', data.error.message);
    }
  } catch (error) {
    Alert.alert('Error', 'Network error. Please try again.');
  }
};
```

---

## SMTP Configuration

### Email Requirements

For email-based authentication and notifications, you need SMTP service for:

- OTP codes
- Magic links
- Password reset
- Email verification
- Notification emails

### Recommended Providers

| Provider | Best For | Pricing |
|----------|----------|---------|
| SendGrid | High volume | Free tier available |
| Mailgun | Developers | Pay as you go |
| Amazon SES | AWS users | Very low cost |
| Postmark | Transactional | Reliable delivery |
| Resend | Modern API | Developer-friendly |

### Backend SMTP Setup

Example using Node.js with Nodemailer:

```javascript
// config/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Send OTP email
async function sendOTPEmail(email, code) {
  await transporter.sendMail({
    from: `"Your App" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: 'Your verification code',
    html: `
      <h1>Your verification code</h1>
      <p>Enter this code to verify your identity:</p>
      <h2 style="letter-spacing: 5px; font-size: 32px;">${code}</h2>
      <p>This code expires in 5 minutes.</p>
    `,
  });
}

// Send magic link email
async function sendMagicLinkEmail(email, token) {
  const link = `${process.env.APP_URL}/auth/magic-link/verify?token=${token}`;
  
  await transporter.sendMail({
    from: `"Your App" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: 'Sign in to Your App',
    html: `
      <h1>Sign in to Your App</h1>
      <p>Click the button below to sign in:</p>
      <a href="${link}" style="...">Sign In</a>
      <p>This link expires in 15 minutes.</p>
    `,
  });
}
```

### Environment Variables

```env
# .env (backend)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxxxxxxxxxxx
SMTP_FROM=noreply@example.com
SMTP_FROM_NAME=Your App
```

---

## SMS Configuration

### For OTP via SMS

Required for `deliveryMethod: 'sms'` or `'both'` in OTP auth.

### Recommended Providers

| Provider | Best For | Features |
|----------|----------|----------|
| Twilio | Most popular | Global coverage |
| Vonage | Enterprise | Good API |
| MessageBird | Europe | Competitive pricing |
| AWS SNS | AWS users | Cost effective |

### Backend SMS Setup

Example using Twilio:

```javascript
// config/sms.js
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendOTPSMS(phoneNumber, code) {
  await client.messages.create({
    body: `Your verification code is: ${code}. It expires in 5 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber,
  });
}
```

### Environment Variables

```env
# .env (backend)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## Social Auth Setup

### Google OAuth

1. Create project in [Google Cloud Console](https://console.cloud.google.com)
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add redirect URIs for Expo

```typescript
// config/auth.config.ts
{
  provider: 'google',
  enabled: true,
  clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
}
```

### Apple Sign In

1. Enable in Apple Developer account
2. Create Sign in with Apple key
3. Configure in app

```typescript
{
  provider: 'apple',
  enabled: true,
  clientId: 'com.yourcompany.app',
}
```

### Implementation

Use `expo-auth-session`:

```typescript
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';

const [request, response, promptAsync] = Google.useAuthRequest({
  clientId: GOOGLE_CLIENT_ID,
  // ... other config
});

const handleGoogleSignIn = async () => {
  const result = await promptAsync();
  if (result?.type === 'success') {
    // Send token to backend
    const response = await fetch('/auth/social/google', {
      method: 'POST',
      body: JSON.stringify({ accessToken: result.authentication.accessToken }),
    });
    // Handle response
  }
};
```

---

## Token Management

### Secure Storage

```typescript
import * as SecureStore from 'expo-secure-store';

// Store token
await SecureStore.setItemAsync('auth_token', token);

// Get token
const token = await SecureStore.getItemAsync('auth_token');

// Delete token
await SecureStore.deleteItemAsync('auth_token');
```

### Token Refresh

Implement token refresh logic:

```typescript
async function fetchWithAuth(url, options = {}) {
  let token = await SecureStore.getItemAsync('auth_token');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (response.status === 401) {
    // Token expired, try refresh
    const refreshToken = await SecureStore.getItemAsync('refresh_token');
    const refreshResponse = await fetch('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    
    if (refreshResponse.ok) {
      const { token: newToken } = await refreshResponse.json();
      await SecureStore.setItemAsync('auth_token', newToken);
      
      // Retry original request
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        },
      });
    } else {
      // Refresh failed, sign out
      signOut();
    }
  }
  
  return response;
}
```

---

## Data API

### Recommended Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/transactions` | GET | List transactions |
| `/transactions` | POST | Create transaction |
| `/transactions/:id` | PUT | Update transaction |
| `/transactions/:id` | DELETE | Delete transaction |
| `/receipts` | GET | List receipts |
| `/receipts` | POST | Upload receipt |
| `/recurring` | GET | List recurring items |
| `/categories` | GET | List categories |
| `/user/profile` | GET | Get user profile |
| `/user/settings` | GET/PUT | User settings |

### Example API Service

```typescript
// services/api.ts
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = {
  async getTransactions() {
    return fetchWithAuth(`${API_URL}/transactions`);
  },
  
  async createTransaction(data) {
    return fetchWithAuth(`${API_URL}/transactions`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // ... more methods
};
```

---

## Security Checklist

### Backend
- [ ] Hash passwords (bcrypt/argon2)
- [ ] Implement rate limiting
- [ ] Use HTTPS only
- [ ] Validate all inputs
- [ ] Implement CORS properly
- [ ] Use short-lived access tokens
- [ ] Implement token refresh
- [ ] Log security events

### Mobile App
- [ ] Use secure storage for tokens
- [ ] Don't store passwords
- [ ] Implement certificate pinning
- [ ] Validate API responses
- [ ] Handle auth errors gracefully
- [ ] Implement biometric auth (optional)

---

## Environment Variables

### App (.env)
```env
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
```

### Backend (.env)
```env
# Database
DATABASE_URL=postgres://...

# Auth
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# SMTP
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=xxx
SMTP_FROM=noreply@example.com

# SMS
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+1xxx

# OAuth
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
APPLE_CLIENT_ID=xxx
APPLE_TEAM_ID=xxx
```
