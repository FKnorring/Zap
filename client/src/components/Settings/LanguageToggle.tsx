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
import LanguageRadioGroup from './LanguageRadio';

interface LanguageToggleProps {
  fixed?: boolean;
}

export default function LanguageToggle({ fixed = true }: LanguageToggleProps) {
  const [open, setOpen] = useState(false);
  const { i18n } = useTranslation(['general']);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            fixed &&
              'fixed top-4 right-4 z-50 bg-white text-black p-2 h-7 font-display'
          )}
        >
          {i18n.language.toUpperCase()}
          <Languages className="h-4 w-4" strokeWidth={2} />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="flex flex-col w-fit space-y-4 p-2 font-display mr-1">
        <div className="grid gap-2 font-display ">
          <LanguageRadioGroup setOpen={setOpen} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
