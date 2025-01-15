import { initializeApp } from "firebase/app";
import { getPerformance } from "firebase/performance";
import { getDatabase } from "firebase/database";
import type { Database } from "firebase/database";
import config from "@/config";

class FirebaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FirebaseError';
  }
}

let app: ReturnType<typeof initializeApp>;
let database: Database;
let perf: ReturnType<typeof getPerformance>;

/**
 * Initialize Firebase with error handling
 * This is called after React mounts
 */
export function initializeFirebase() {
  const firebaseConfig = {
    apiKey: config.FIREBASE.API_KEY,
    authDomain: config.FIREBASE.AUTH_DOMAIN,
    projectId: config.FIREBASE.PROJECT_ID,
    storageBucket: config.FIREBASE.STORAGE_BUCKET,
    messagingSenderId: config.FIREBASE.MESSAGING_SENDER_ID,
    appId: config.FIREBASE.APP_ID,
    databaseURL: config.FIREBASE.DATABASE_URL,
    measurementId: config.FIREBASE.MEASUREMENT_ID,
  };

  // Validate required configuration
  if (!config.FIREBASE.API_KEY) {
    throw new FirebaseError('Firebase API key is missing. Check your environment variables.');
  }
  if (!config.FIREBASE.DATABASE_URL) {
    throw new FirebaseError('Firebase database URL is missing. Check your environment variables.');
  }

  try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    perf = getPerformance(app);
  } catch (error) {
    throw new FirebaseError(
      `Failed to initialize Firebase: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get Firebase services with initialization check
 */
export function getFirebaseServices() {
  if (!app || !database || !perf) {
    throw new FirebaseError('Firebase has not been initialized. Call initializeFirebase first.');
  }
  return { database, perf };
}
