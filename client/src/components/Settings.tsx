import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useTranslation } from 'react-i18next';
import Profile from '@/pages/User/Profile';
import { ChevronDown, LogIn, User } from 'lucide-react';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { Separator } from '@radix-ui/react-dropdown-menu';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const { isAuthenticated, logout } = useKindeAuth();

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="text-lg flex flex-row items-center">
          <User size={24} />
          {t('general:settings')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-80 w-fit">
        <div className="grid gap-2">
          <Collapsible open={isLanguageOpen} onOpenChange={setIsLanguageOpen}>
            <CollapsibleTrigger className="flex flex-row w-full items-center text-left px-4 py-2 font-display hover:bg-primary/90 rounded">
              <ChevronDown
                className="w-4 h-4 mr-2"
                style={{
                  transform: isLanguageOpen ? `rotate(180deg)` : 'none',
                }}
              />
              {t('general:language')}
            </CollapsibleTrigger>

            <CollapsibleContent className="px-4 py-2 bg-gray-50 rounded">
              <div className="grid gap-2">
                <button
                  onClick={() => handleLanguageChange('en')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded"
                >
                  {t('general:english')}
                </button>
                <button
                  onClick={() => handleLanguageChange('sv')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded"
                >
                  {t('general:swedish')}
                </button>
              </div>
            </CollapsibleContent>
          </Collapsible>
          {isAuthenticated && (
            <>
              <Collapsible
                open={isAppearanceOpen}
                onOpenChange={setIsAppearanceOpen}
              >
                <CollapsibleTrigger className="flex flex-row w-full items-center text-left px-4 py-2 font-display hover:bg-primary/90 rounded">
                  <ChevronDown
                    className="w-4 h-4 mr-2"
                    style={{
                      transform: isAppearanceOpen ? `rotate(180deg)` : 'none',
                    }}
                  />
                  {t('general:appearance')}
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 py-2 bg-gray-50 rounded">
                  <div className="grid gap-2">
                    <Profile />
                  </div>
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <div>
                <Button
                  className="w-full text-left px-4 hover:bg-gray-100 rounded"
                  onClick={logout}
                >
                  <LogIn size={16} transform="rotate(180)" />
                  {t('general:logout')}
                </Button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
