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
import { ChevronDown, LogIn } from 'lucide-react';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

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
          {t('general:profile')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-3 ">
        <div className="grid gap-2">
          <Collapsible open={isLanguageOpen} onOpenChange={setIsLanguageOpen}>
            <CollapsibleTrigger className="flex flex-row w-full items-center text-left px-2 py-2 font-display hover:bg-primary/90 rounded">
              <ChevronDown
                className="w-4 h-4 mr-2"
                strokeWidth={3}
                style={{
                  transition: 'transform 0.2s ease',
                  transform: isLanguageOpen ? `rotate(180deg)` : 'none',
                }}
              />
              {t('general:language')}
            </CollapsibleTrigger>

            <CollapsibleContent className="px-4 py-3 rounded bg-gray-200">
              <div className="grid gap-2 font-display ">
                <RadioGroup defaultValue={i18n.language}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="sv"
                      id="sv"
                      onClick={() => handleLanguageChange('sv')}
                    />
                    <Label className="cursor-pointer" htmlFor="sv">
                      {t('general:swedish')}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="en"
                      id="en"
                      onClick={() => handleLanguageChange('en')}
                    />
                    <Label className="cursor-pointer" htmlFor="en">
                      {t('general:english')}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CollapsibleContent>
          </Collapsible>
          {isAuthenticated && (
            <>
              <Collapsible
                open={isAppearanceOpen}
                onOpenChange={setIsAppearanceOpen}
              >
                <CollapsibleTrigger className="flex flex-row w-full items-center text-left px-2 py-2 font-display hover:bg-primary/90 rounded">
                  <ChevronDown
                    className="w-4 h-4 ml-0 mr-2"
                    strokeWidth={3}
                    style={{
                      transition: 'transform 0.2s ease',
                      transform: isAppearanceOpen ? `rotate(180deg)` : 'none',
                    }}
                  />
                  {t('general:appearance')}
                </CollapsibleTrigger>
                <CollapsibleContent className="px-2 py-2 bg-gray-200 rounded">
                  <div className="grid gap-2">
                    <Profile />
                  </div>
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <div>
                <Button className="w-full rounded" onClick={logout}>
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
