import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import { Header } from "./components/Header";
import { AppRoutes } from "./routes/AppRoutes";
import { Toaster } from "sonner";
import { AppProvider } from "./contexts/App/provider";
import OngoingQuizHandler from "./components/OngoingQuizHandler";

const environment = import.meta.env.VITE_ENVIRONMENT;

const uri =
  environment === "DEV"
    ? "http://localhost:5173"
    : "https://game-shack-iota.vercel.app/";

function App() {
  return (
    <div className="min-h-dvh bg-background bg-[url('/assets/bg-mobile.svg')] md:bg-[url('/assets/bg-desktop.svg')] bg-cover bg-no-repeat bg-center text-white">
      <main className="min-h-dvh max-h-dvh flex flex-col relative">
        <KindeProvider
          clientId="7b50afa95aec4cba88bad0abb4b94dfa"
          domain="https://gameshack.kinde.com"
          redirectUri={uri}
          logoutUri={uri}
        >
          <AppProvider>
            <Header />
            <AppRoutes />
            <OngoingQuizHandler />
            <Toaster />
          </AppProvider>
        </KindeProvider>
      </main>
    </div>
  );
}

export default App;
