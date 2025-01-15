/**
 * Normalizes environment strings to either "prod" or "dev"
 * Accepts variations like "PROD", "PRODUCTION", "prod", "production", "DEV", "DEVELOPMENT", etc.
 */
export const normalizeEnvironment = (env: string | undefined): "prod" | "dev" => {
  if (!env) return "dev";
  
  const normalized = env.toLowerCase();
  if (normalized.startsWith("prod")) return "prod";
  if (normalized.startsWith("dev")) return "dev";
  return "dev"; // Default to dev for any other value
};

/**
 * Gets environment variables safely with development logging
 */
export const getEnvVar = (key: string): string | undefined => {
  // In browser environment, use import.meta.env
  if (typeof window !== 'undefined') {
    const value = import.meta.env[key];
    if (import.meta.env.DEV) {
      if (!value) {
        console.warn(`Environment variable ${key} is not set`);
      } else {
        console.debug(`Environment variable ${key} is set to:`, value);
      }
    }
    return value;
  }

  // In Node.js environment (like Vite config), use process.env
  if (typeof process !== 'undefined') {
    const value = process.env[key];
    if (process.env.NODE_ENV === 'development') {
      console.debug(`Loading ${key} from process.env:`, value);
    }
    return value;
  }

  return undefined;
}; 