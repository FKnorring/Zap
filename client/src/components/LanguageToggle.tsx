import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  fixed?: boolean;
}

export default function LanguageToggle({ fixed = true }: LanguageToggleProps) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation(['general']);

  function changeLanguage(lang: string) {
    i18n.changeLanguage(lang);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            fixed && 'fixed top-4 right-4 z-50 bg-white text-black p-2 h-7'
          )}
        >
          {i18n.language.toUpperCase()}
          <Languages className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="flex flex-col w-36 space-y-2 p-1">
        <Button variant="outline" onClick={() => changeLanguage('en')}>
          {t('general:english')}
        </Button>
        <Button variant="outline" onClick={() => changeLanguage('sv')}>
          {t('general:swedish')}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
