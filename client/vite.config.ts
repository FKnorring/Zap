import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  // Debug env loading in development
  if (mode === 'development') {
    console.log('Loading environment variables:', {
      FIREBASE_API_KEY: env.VITE_FIREBASE_APIKEY ? 'set' : 'missing',
      FIREBASE_DB_URL: env.VITE_FIREBASE_DATABASEURL ? 'set' : 'missing',
    });
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: parseInt(env.VITE_PORT || '5173'),
      host: true,
    },
    // Make env variables available during build time
    define: {
      'process.env': env
    }
  };
});
