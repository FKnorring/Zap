import { useTranslation } from 'react-i18next';
import { Slide, SlideTypes } from '@/models/Quiz';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Info } from 'lucide-react';
import { ToolbarProps } from '@/slides/toolbar';

export default function InfoBox<T extends Slide>({ slide }: ToolbarProps<T>) {
  const { t } = useTranslation(['slideDescriptions']);

  const infoText =
    slide.type == SlideTypes.question ? slide.questionType : slide.type;
  return (
    <Popover>
      <PopoverTrigger>
        <Info />
      </PopoverTrigger>
      <PopoverContent className="font-display">{t(infoText)}</PopoverContent>
    </Popover>
  );
}
