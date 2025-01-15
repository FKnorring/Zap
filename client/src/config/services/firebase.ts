import { getEnvVar } from '@/config/core/environment';

/**
 * Formats the Firebase database URL
 */
const formatFirebaseDBUrl = (url: string | undefined): string => {
  if (!url) {
    console.error('Firebase database URL is not set');
    return "";
  }

  // If it's already a full URL, return it
  if (url.startsWith('https://')) {
    return url;
  }

  // If it's just the database name, format it
  return `https://${url}.firebaseio.com`;
};

/**
 * Firebase configuration settings
 */
export const firebaseConfig = {
  API_KEY: getEnvVar('VITE_FIREBASE_APIKEY') || "",
  AUTH_DOMAIN: getEnvVar('VITE_FIREBASE_AUTHDOMAIN') || "",
  PROJECT_ID: getEnvVar('VITE_FIREBASE_PROJECTID') || "",
  STORAGE_BUCKET: getEnvVar('VITE_FIREBASE_STORAGEBUCKET') || "",
  MESSAGING_SENDER_ID: getEnvVar('VITE_FIREBASE_MESSAGINGSENDERID') || "",
  APP_ID: getEnvVar('VITE_FIREBASE_APPID') || "",
  DATABASE_URL: formatFirebaseDBUrl(getEnvVar('VITE_FIREBASE_DATABASEURL')),
  MEASUREMENT_ID: getEnvVar('VITE_FIREBASE_MEASUREMENTID') || "",
};

// Validate required Firebase configuration with more detailed logging
if (!firebaseConfig.API_KEY || !firebaseConfig.DATABASE_URL) {
  console.error('Firebase configuration is missing required fields:', {
    apiKey: {
      value: firebaseConfig.API_KEY,
      envVar: 'VITE_FIREBASE_APIKEY',
      status: firebaseConfig.API_KEY ? 'set' : 'missing'
    },
    databaseUrl: {
      value: firebaseConfig.DATABASE_URL,
      envVar: 'VITE_FIREBASE_DATABASEURL',
      status: firebaseConfig.DATABASE_URL ? 'set' : 'missing'
    }
  });
} 