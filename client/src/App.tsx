import { useEffect, useState } from 'react';
import { KindeProvider } from '@kinde-oss/kinde-auth-react';
import { Header } from './components/Header';
import { AppRoutes } from './routes/AppRoutes';
import { Toaster } from 'sonner';
import { AppProvider } from './contexts/App/provider';
import OngoingQuizHandler from './components/OngoingQuizHandler';
import { TutorialProvider } from './contexts/Tutorial/context';
import { TutorialOverlay } from './components/tutorial/TutorialOverlay';
import config from '@/config';
import ErrorBoundary from './components/errors/ErrorBoundary';
import { initializeFirebase } from './firebase';

function App() {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      initializeFirebase();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize app'));
    }
  }, []);

  if (error) {
    throw error; // This will be caught by the error boundary
  }

  return (
    <ErrorBoundary>
      <div className="min-h-dvh inset-0 fixed bg-background bg-[url('/assets/bg-mobile.svg')] md:bg-[url('/assets/bg-desktop.svg')] bg-cover bg-no-repeat bg-center text-white">
        <main className="min-h-dvh max-h-dvh flex flex-col relative">
          <KindeProvider
            clientId={config.KINDE.CLIENT_ID}
            domain={config.KINDE.DOMAIN}
            redirectUri={config.KINDE.REDIRECT_URI}
            logoutUri={config.KINDE.LOGOUT_URI}
          >
            <AppProvider>
              <TutorialProvider>
                <Header />
                <AppRoutes />
                <OngoingQuizHandler />
                <Toaster />
                <TutorialOverlay disabled={false} />
              </TutorialProvider>
            </AppProvider>
          </KindeProvider>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
