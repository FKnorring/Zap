import { initializeApp } from "firebase/app";
import { getPerformance,  } from "firebase/performance";
import { getDatabase } from "firebase/database";
import type { Database } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  //databaseURL: import.meta.env.VITE_FIREBASE_APIKEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASEURL,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID,
};

const app = initializeApp(firebaseConfig);
const database: Database = getDatabase(app);
const perf = getPerformance(app);

perf.dataCollectionEnabled = true;
perf.instrumentationEnabled = true;

export { database, perf };
