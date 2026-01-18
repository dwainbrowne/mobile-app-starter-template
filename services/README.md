# Services

This folder contains centralized services for the Mobile Starter Template app.

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
