# Services

This folder contains centralized services for the Mobile Starter Template app.

## Architecture Overview

```
services/
├── api.service.ts       → Generic API service for all HTTP requests
├── cache.service.ts     → AsyncStorage-based caching
├── querystring.service.ts → URL query string utilities
├── settings.service.ts  → App settings persistence
├── webcache.service.ts  → Web-specific caching
└── index.ts             → Barrel exports
```

## API Service

The `api.service.ts` provides a centralized HTTP client with authentication, caching, and error handling.

### Basic Usage

```typescript
import { apiService } from '@/services';
import { API_ENDPOINTS } from '@/constants/api';

// GET request
const response = await apiService.get<User>(API_ENDPOINTS.USERS.PROFILE);

// GET with caching
const cached = await apiService.getCached<Transaction[]>(
  API_ENDPOINTS.TRANSACTIONS.BASE,
  30000 // 30 second cache
);

// POST request
const created = await apiService.post<Transaction>(
  API_ENDPOINTS.TRANSACTIONS.BASE,
  { amount: 100, description: 'Test' }
);

// PUT request
const updated = await apiService.put<Transaction>(
  API_ENDPOINTS.TRANSACTIONS.BY_ID('123'),
  { amount: 150 }
);

// DELETE request
const deleted = await apiService.delete(API_ENDPOINTS.TRANSACTIONS.BY_ID('123'));
```

### Configuration

All API configuration is centralized in `@/constants/api.ts`:

```typescript
import { 
  API_BASE_URL,
  API_ENDPOINTS,
  CACHE_CONFIG,
  ENV_CONFIG 
} from '@/constants/api';

// Check current environment
console.log(ENV_CONFIG.baseUrl); // Different for dev/prod
```

### Authentication

Set up the token getter from your AuthContext:

```typescript
// In AuthContext.tsx
import { apiService } from '@/services';

useEffect(() => {
  apiService.setTokenGetter(async () => {
    // Return your auth token
    return accessToken;
  });
  
  apiService.setOnUnauthorized(() => {
    // Handle 401 - redirect to login
    signOut();
  });
}, []);
```

## Cache Service

The `cache.service.ts` provides AsyncStorage-based caching with expiration.

### Usage

```typescript
import { cacheService } from '@/services';
import { CACHE_CONFIG } from '@/constants/api';

// Set with expiry
await cacheService.set('my-key', data, CACHE_CONFIG.EXPIRY.MEDIUM);

// Get cached value
const cached = await cacheService.get<MyType>('my-key');

// Fetch with cache (auto-caches API results)
const data = await cacheService.fetchWithCache(
  'unique-key',
  () => fetch('/api/data').then(r => r.json()),
  CACHE_CONFIG.EXPIRY.LONG
);

// Clear specific key
await cacheService.clearKey('my-key');

// Clear all cache
await cacheService.clearCache();
```

## Query String Service

The `querystring.service.ts` provides utilities for building and parsing URL query strings, particularly useful for passing settings to iframes or external applications.

### Usage

```typescript
import { 
  buildQueryString, 
  appendQueryToUrl, 
  createIframeUrl,
  getThemeQueryParams 
} from '@/services';

// Build a simple query string
const qs = buildQueryString({
  theme: 'ocean',
  darkMode: true,
  currency: 'USD'
});
// Result: "theme=ocean&darkMode=1&currency=USD"

// Append params to a URL
const url = appendQueryToUrl('https://app.example.com', {
  theme: 'forest',
  darkMode: true
});
// Result: "https://app.example.com?theme=forest&darkMode=1"

// Create iframe URL with settings
const iframeUrl = createIframeUrl('https://embed.example.com', {
  theme: 'midnight',
  darkMode: true,
  currency: 'EUR',
  language: 'en'
});
```

### With React Hooks

```typescript
import { useIframeUrl, useThemeQueryString } from '@/hooks/use-iframe-url';

function MyComponent() {
  // Get theme params as query string
  const themeQs = useThemeQueryString();
  // Result: "theme=grey&darkMode=1"
  
  // Get full iframe URL with settings
  const iframeUrl = useIframeUrl('https://embed.example.com', {
    includeTheme: true,
    includeLocale: true,
    customParams: { feature: 'dashboard' }
  });
}
```

## Settings Service

The `settings.service.ts` provides utilities for managing app settings and generating iframe parameters from settings.

### Usage

```typescript
import { 
  buildSettingsQueryParams,
  createSettingsIframeUrl 
} from '@/services';

// Build query params from settings object
const params = buildSettingsQueryParams(settings);

// Create iframe URL directly from settings
const url = createSettingsIframeUrl('https://embed.example.com', settings);
```
