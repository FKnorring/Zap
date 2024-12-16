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
import { ChevronDown } from 'lucide-react';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Settings</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <Collapsible open={isLanguageOpen} onOpenChange={setIsLanguageOpen}>
            <CollapsibleTrigger className="flex flex-row w-full items-center text-left px-4 py-2 font-medium hover:bg-gray-100 rounded">
              <ChevronDown
                className="w-4 h-4 mr-2"
                style={{
                  transform: isLanguageOpen ? `rotate(180deg)` : 'none',
                }}
              />
              Språk
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

          <Collapsible
            open={isAppearanceOpen}
            onOpenChange={setIsAppearanceOpen}
          >
            <CollapsibleTrigger className="flex flex-row w-full items-center text-left px-4 py-2 font-medium hover:bg-gray-100 rounded">
              <ChevronDown
                className="w-4 h-4 mr-2"
                style={{
                  transform: isAppearanceOpen ? `rotate(180deg)` : 'none',
                }}
              />
              Appearance
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 py-2 bg-gray-50 rounded">
              <div className="grid gap-2">
                <Profile />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Additional Settings (e.g., Log out) */}
          <div>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">
              Log out
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
