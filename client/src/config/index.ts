import { ConfigData } from '@/config/core/types';
import { normalizeEnvironment, getEnvVar } from '@/config/core/environment';
import { baseURI } from '@/config/core/uri';
import { firebaseConfig } from '@/config/services/firebase';
import { kindeConfig } from '@/config/services/kinde';

/**
 * Application configuration object
 * All values can be overridden using environment variables prefixed with VITE_
 */
const config: ConfigData = {
  // Core application settings
  BASE_URL: getEnvVar('VITE_BASE_URL') || "/",
  LOAD_PATH_i18: getEnvVar('VITE_LOAD_PATH_i18') || "/locales/{{lng}}/{{ns}}.json",
  ROUTER_BASE_NAME: getEnvVar('VITE_ROUTER_BASE_NAME') || "",
  URI: baseURI,
  
  // Environment settings
  ENVIRONMENT: normalizeEnvironment(getEnvVar('VITE_ENVIRONMENT')),
  IS_PRODUCTION: normalizeEnvironment(getEnvVar('VITE_ENVIRONMENT')) === "prod",
  PORT: parseInt(getEnvVar('VITE_PORT') || "5173"),
  
  // External services configuration
  FIREBASE: firebaseConfig,
  KINDE: kindeConfig,
};

// Export the default config object
export default config;

// Re-export other configuration
export * from '@/config/features/flags';
export * from '@/config/features/values';
export * from '@/config/game/languages';
export * from '@/config/game/limits';
