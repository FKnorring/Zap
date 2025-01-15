import { getEnvVar } from '@/config/core/environment';
import { baseURI } from '@/config/core/uri';

/**
 * Kinde authentication configuration
 */
export const kindeConfig = {
  CLIENT_ID: getEnvVar('VITE_KINDE_CLIENT_ID') || "7b50afa95aec4cba88bad0abb4b94dfa",
  DOMAIN: getEnvVar('VITE_KINDE_DOMAIN') || "https://gameshack.kinde.com",
  REDIRECT_URI: getEnvVar('VITE_KINDE_REDIRECT_URI') || baseURI,
  LOGOUT_URI: getEnvVar('VITE_KINDE_LOGOUT_URI') || baseURI,
}; 