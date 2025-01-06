import { Button } from '@/components/ui/button';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { Menu, Zap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import Settings from '@/components/Settings/Settings';
import Tools from '@/components/Tools';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';

export function Header() {
  const location = useLocation();
  const { isAuthenticated, login, register } = useKindeAuth();
  const [showHeader, setShowHeader] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const { t } = useTranslation();
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (location.pathname.endsWith('/lobby')) {
        if (e.clientY < 100) {
          // Clear any existing timeout
          if (timeoutId) clearTimeout(timeoutId);
          // Set a new timeout
          const id = window.setTimeout(() => {
            setShowHeader(true);
          }, 300); // 300ms delay
          setTimeoutId(id);
        } else {
          // Clear timeout if mouse moves away
          if (timeoutId) clearTimeout(timeoutId);
          setShowHeader(false);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [location.pathname, timeoutId]);

  const inLobby = location.pathname.endsWith('/lobby');
  const inGame = location.pathname.startsWith('/play');

  const [isLargeScreen] = useState(window.innerWidth >= 1024); // Assuming 1024px is the breakpoint for large screens

  if (inLobby && !showHeader) {
    return null;
  }

  // Header for large screens
  if (isLargeScreen) {
    return (
      <header
        className={cn(
          'bg-black/40 md:block transition-opacity duration-200 border-b-2  border-b-primary shadow shadow-black/20 z-50',
          inLobby && 'absolute top-0 left-0 right-0',
          inGame && 'hidden'
        )}
      >
        <div className="container flex h-16 items-center px-1 overflow-hidden">
          <div className={cn('mr-0 md:flex w-full', inGame && 'hidden')}>
            <nav className="flex items-center space-x-6 font-medium w-full justify-between">
              <Link
                to="/"
                className="flex items-center gap-2 text-2xl font-display"
              >
                <Zap className="text-yellow-400" size={32} />
                <span className="fancy-wrap">Zap!</span>
              </Link>

              <div className="flex items-center font-display gap-1">
                <Link to="/play">
                  <Button
                    variant={
                      location.pathname === '/play' ? 'default' : 'ghost'
                    }
                    className="text-lg"
                  >
                    {t('general:play')}
                  </Button>
                </Link>

                <Link to="/">
                  <Button
                    variant={location.pathname === '/' ? 'default' : 'ghost'}
                    className="text-lg"
                  >
                    {t('general:home')}
                  </Button>
                </Link>

                <Link to="/about">
                  <Button
                    variant={
                      location.pathname === '/about' ? 'default' : 'ghost'
                    }
                    className="text-lg"
                  >
                    {t('general:about')}
                  </Button>
                </Link>
                <Tools />
                {!isAuthenticated && (
                  <>
                    <Button
                      variant="ghost"
                      className="text-lg"
                      onClick={() => login()}
                    >
                      {t('general:login')}
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-lg bg-green-600"
                      onClick={() => register()}
                    >
                      {t('general:register')}
                    </Button>
                  </>
                )}
                <Settings />
              </div>
            </nav>
          </div>
        </div>
      </header>
    );
  }

  // For small screens
  return (
    <header
      className={cn(
        'bg-black/40 md:block transition-opacity duration-200 border-b-2  border-b-primary shadow shadow-black/20 z-50',
        inLobby && 'absolute top-0 left-0 right-0',
        inGame && 'hidden'
      )}
    >
      <div className="container flex h-16 items-center px-1 overflow-hidden">
        <div className={cn('mr-0 md:flex w-full', inGame && 'hidden')}>
          <nav className="flex items-center space-x-6 font-medium w-full justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-display"
            >
              <Zap className="text-yellow-400" size={32} />
              <span className="fancy-wrap">Zap!</span>
            </Link>

            <div className="flex items-center font-display gap-1">
              {isAuthenticated ? (
                <Link to="/">
                  <Button
                    variant={location.pathname === '/' ? 'default' : 'ghost'}
                    className="text-lg"
                  >
                    {t('general:home')}
                  </Button>
                </Link>
              ) : (
                <Link to="/play">
                  <Button
                    variant="ghost"
                    className="text-lg bg-green-600"
                    isInteractive
                  >
                    {t('general:play')}
                  </Button>
                </Link>
              )}
              <Settings />
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger
                  className="ml-2 mr-3 text-2xl"
                  onClick={() => setSheetOpen(true)}
                >
                  <Menu />
                </SheetTrigger>
                <SheetContent className="w-full border-none font-display text-xl text-white">
                  <SheetHeader>
                    <SheetDescription className="flex flex-col space-y-3 text-left pt-14">
                      <Link to="/">
                        <Button
                          className="text-2xl"
                          variant="link"
                          onClick={() => setSheetOpen(false)}
                        >
                          {t('general:home')}
                        </Button>
                      </Link>
                      <Link to="/about">
                        <Button
                          className="text-2xl"
                          variant="link"
                          onClick={() => setSheetOpen(false)}
                        >
                          {t('general:about')}
                        </Button>
                      </Link>
                      <Link to="/tools/team-generator">
                        <Button
                          className="text-2xl"
                          variant="link"
                          onClick={() => setSheetOpen(false)}
                        >
                          {t('general:tools')}
                        </Button>
                      </Link>
                      {!isAuthenticated && (
                        <div className="pt-20 flex flex-col space-y-2">
                          <Button
                            className="text-lg"
                            onClick={() => login()}
                            variant="link"
                          >
                            {t('general:login')}
                          </Button>
                          <Button
                            className="text-lg"
                            onClick={() => register()}
                          >
                            {t('general:register')}
                          </Button>
                        </div>
                      )}
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
