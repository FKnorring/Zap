import { PlusCircle } from 'lucide-react';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { SlideCreationMenu } from './SlideCreationMenu';
import { useTranslation } from 'react-i18next';
import { QuestionTypes } from '@/models/Quiz';
import { SlideTypes } from '@/models/Quiz';

interface SlideInsertAreaProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  index: number | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onMenuMouseEnter: () => void;
  onMenuMouseLeave: () => void;
  onAddSlide: Parameters<typeof SlideCreationMenu>[0]['onAddSlide'];
  isEndButton?: boolean;
}

export function SlideInsertArea({
  isOpen,
  setIsOpen,
  index,
  onMouseEnter,
  onMouseLeave,
  onMenuMouseEnter,
  onMenuMouseLeave,
  onAddSlide,
  isEndButton,
}: SlideInsertAreaProps) {
  const { t } = useTranslation(['questions']);

  if (isEndButton) {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger id="add-slide-button" asChild>
          <div
            className="bg-white border-grey-300 aspect-video border-2 border-dashed rounded flex items-center justify-center cursor-pointer
              hover:border-primary hover:bg-primary/5 transition-colors mt-2"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <PlusCircle className="w-4 h-4 text-muted-foreground " />
            <h1 className="text-muted-foreground pl-1">{t('addSlide')}</h1>
          </div>
        </PopoverTrigger>
        <SlideCreationMenu
          onCloseMenu={() => setIsOpen(false)}
          onAddSlide={onAddSlide}
          onMouseEnter={onMenuMouseEnter}
          onMouseLeave={onMenuMouseLeave}
        />
      </Popover>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className="group cursor-pointer z-10"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="h-2 w-full group-hover:h-8 group-hover:border-2 group-hover:border-dashed group-hover:border-primary/50 group-hover:bg-primary/5 rounded transition-all duration-350 delay-100"></div>
        </div>
      </PopoverTrigger>
      <SlideCreationMenu
        onCloseMenu={() => setIsOpen(false)}
        onAddSlide={(type: SlideTypes, questionType?: QuestionTypes) => {
          onAddSlide(type, questionType, index ?? undefined);
          setIsOpen(false);
        }}
        onMouseEnter={onMenuMouseEnter}
        onMouseLeave={onMenuMouseLeave}
      />
    </Popover>
  );
}
