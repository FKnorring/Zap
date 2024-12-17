import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';

interface SlideOptionProps {
  slideType: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}

export function SlideOption({
  label,
  slideType,
  icon: Icon,
  onClick,
}: SlideOptionProps) {
  const { t } = useTranslation(['slideDescriptions']);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onClick}
          >
            <Icon className="mr-2 h-4 w-4" />
            {label}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" align="center" className="font-display">
          <p>{t(slideType)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
