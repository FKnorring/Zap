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
import Profile from '@/components/Settings/Profile';
import {
  ChevronDown,
  CircleUserRound,
  Languages,
  LogIn,
  MessageCircleQuestion,
  UserPen,
} from 'lucide-react';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAppContext } from '@/contexts/App/context';
import { Separator } from '@/components/ui/separator';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const { isAuthenticated, logout } = useKindeAuth();
  const {
    user: { user, updateUser },
  } = useAppContext();

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleTutorialToggle = (enabled: boolean) => {
    if (user) {
      updateUser({
        ...user,
        tutorialsDisabled: !enabled,
      });
    }
  };

  const handleResetTutorials = () => {
    if (user) {
      updateUser({
        ...user,
        completedTutorials: [],
      });
    }
  };

  return (
    <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="text-lg flex flex-row items-center">
          {t('general:profile')}
          <ChevronDown
            className="w-4 h-4"
            strokeWidth={3}
            style={{
              transition: 'transform 0.2s ease',
              transform: isSettingsOpen ? `rotate(180deg)` : 'none',
            }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-3 ">
        <div className="grid gap-2">
          {isAuthenticated && (
            <>
              <div className="flex items-center space-x-2 w-[200px]">
                <CircleUserRound className="w-6 h-6" />
                <p className="font-display truncate text-sm">{user?.email}</p>
              </div>
              <Separator className=" w-full" />
            </>
          )}
          <Collapsible open={isLanguageOpen} onOpenChange={setIsLanguageOpen}>
            <CollapsibleTrigger className="flex flex-row w-full items-center px-2 py-2 font-display hover:bg-primary/90 rounded justify-between">
              <div className="flex items-center">
                <Languages className="w-4 h-4 mr-2" strokeWidth={3} />
                {t('general:language')}
              </div>

              <ChevronDown
                className="w-4 h-4"
                strokeWidth={3}
                style={{
                  transition: 'transform 0.2s ease',
                  transform: isLanguageOpen ? 'rotate(180deg)' : 'none',
                }}
              />
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
                <CollapsibleTrigger className="flex flex-row w-full items-center px-2 py-2 font-display hover:bg-primary/90 rounded justify-between">
                  <div className="flex items-center">
                    <UserPen className="w-4 h-4 mr-2" strokeWidth={3} />
                    {t('general:appearance')}
                  </div>

                  <ChevronDown
                    className="w-4 h-4"
                    strokeWidth={3}
                    style={{
                      transition: 'transform 0.2s ease',
                      transform: isAppearanceOpen ? 'rotate(180deg)' : 'none',
                    }}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-2 py-2 bg-gray-200 rounded">
                  <div className="grid gap-2">
                    <Profile />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible
                open={isTutorialOpen}
                onOpenChange={setIsTutorialOpen}
              >
                <CollapsibleTrigger className="flex flex-row w-full items-center px-2 py-2 font-display hover:bg-primary/90 rounded justify-between">
                  <div className="flex items-center">
                    <MessageCircleQuestion
                      className="w-4 h-4 mr-2"
                      strokeWidth={3}
                    />
                    {t('general:tutorial')}
                  </div>

                  <ChevronDown
                    className="w-4 h-4"
                    strokeWidth={3}
                    style={{
                      transition: 'transform 0.2s ease',
                      transform: isTutorialOpen ? 'rotate(180deg)' : 'none',
                    }}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 py-3 rounded bg-gray-200">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="tutorial-toggle">
                        {t('general:tutorial.enabled')}
                      </Label>
                      <Switch
                        id="tutorial-toggle"
                        checked={!user?.tutorialsDisabled}
                        onCheckedChange={handleTutorialToggle}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResetTutorials}
                      className="w-full"
                    >
                      {t('general:tutorial.reset')}
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <div>
                <Button
                  className="w-full rounded text-red-500"
                  onClick={logout}
                  variant="outline"
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
