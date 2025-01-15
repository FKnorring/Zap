export interface ConfigData {
  /** Base URL for the application (e.g., "/" or "/app") */
  BASE_URL: string;
  /** Path pattern for loading i18n translation files */
  LOAD_PATH_i18: string;
  /** Base name for the router (useful for subdirectory deployments) */
  ROUTER_BASE_NAME: string;
  /** Full URI of the application (e.g., "http://localhost:5173") */
  URI: string;
  /** Current environment ("dev" or "prod") */
  ENVIRONMENT: string;
  /** Whether the app is running in production mode */
  IS_PRODUCTION: boolean;
  /** Port number for the development server */
  PORT: number;
  /** Firebase configuration settings */
  FIREBASE: {
    API_KEY: string;
    AUTH_DOMAIN: string;
    PROJECT_ID: string;
    STORAGE_BUCKET: string;
    MESSAGING_SENDER_ID: string;
    APP_ID: string;
    DATABASE_URL: string;
    MEASUREMENT_ID: string;
  };
  /** Kinde authentication settings */
  KINDE: {
    CLIENT_ID: string;
    DOMAIN: string;
    REDIRECT_URI: string;
    LOGOUT_URI: string;
  }
} 