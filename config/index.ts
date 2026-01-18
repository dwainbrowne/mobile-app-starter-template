/**
 * CONFIG INDEX
 *
 * Central export for all configuration.
 * Import from '@/config' to access everything.
 */

// App config
export { appColors, appFeatures, appIdentity, defaultUser } from './app';

// Auth config (authentication type, branding, version, legal links)
export {
    AUTH_TYPE,
    authConfig,
    brandingConfig,
    getEnabledSocialProviders,
    getFormattedVersion,
    getFullVersionString,
    isOTPAuth,
    isStandardAuth,
    legalLinksConfig,
    otpAuthConfig,
    socialProvidersConfig,
    standardAuthConfig,
    versionInfo
} from './auth.config';

// Layout config (spacing, sizing, overlays, animations)
export {
    animation,
    layout,
    overlay,
    shadows,
    spacing,
    springs
} from './layout.config';

// Navigation configs
export { default as quickActionsNavigation } from './quickactions.navigation';
export { default as siteNavigation } from './site.navigation';
export { default as tabsNavigation } from './tabs.navigation';

