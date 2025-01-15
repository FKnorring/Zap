import { normalizeEnvironment, getEnvVar } from '@/config/core/environment';

/**
 * Gets the appropriate URI based on environment and configuration
 */
export const getURI = (env: string | undefined, configuredURI: string | undefined): string => {
  const environment = normalizeEnvironment(env);
  
  if (environment === "dev") {
    return "http://localhost:5173";
  }
  
  return configuredURI || "https://www.zap-quiz.com/";
};

// Get base URI to avoid circular dependency
export const baseURI = getURI(
  getEnvVar('VITE_ENVIRONMENT'),
  getEnvVar('VITE_URI')
); 