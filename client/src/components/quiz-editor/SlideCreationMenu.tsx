import { useEffect, useRef, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { PopoverContent } from '@/components/ui/popover';
import { type SlideType, type QuestionType, SlideTypes } from '@/models/Quiz';
import * as Slides from '@/slides';
import { SlideOption } from './SlideOption';
import { SlideInfo } from '@/slides';
import { useTranslation } from 'react-i18next';

interface SlideCreationMenuProps {
  onAddSlide: (type: SlideType, questionType?: QuestionType) => void;
  onCloseMenu?: () => void;
}

// Replace existing slides and questions arrays with optionGroups
const optionGroups = [
  {
    label: 'slides',
    options: Object.values(Slides)
      .filter(
        (slide) =>
          slide.Info.slideType !== SlideTypes.question && !slide.Info.uneditable
      )
      .map((slide) => slide.Info),
  },
  {
    label: 'questionTypes',
    options: Object.values(Slides)
      .filter(
        (slide) =>
          slide.Info.slideType === SlideTypes.question && !slide.Info.uneditable
      )
      .map((slide) => slide.Info),
  },
] as const;

interface RenderOptionsProps {
  options: SlideInfo[];
  onAddSlide: (type: SlideType, questionType?: QuestionType) => void;
  onCloseMenu?: () => void;
}

function RenderOptions({
  options,
  onAddSlide,
  onCloseMenu,
}: RenderOptionsProps) {
  const { t } = useTranslation(['questions']);

  return options.map((option) => {
    return (
      <SlideOption
        key={option.value}
        label={t(option.label)}
        icon={option.icon}
        onClick={() => {
          onAddSlide(option.slideType, option.questionType);
          onCloseMenu?.();
        }}
      />
    );
  });
}

export function SlideCreationMenu({
  onAddSlide,
  onCloseMenu,
}: SlideCreationMenuProps) {
  const [closeTimeout, setCloseTimeout] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(['quizEditor']);

  const handleMouseLeave = () => {
    const timeoutId = window.setTimeout(() => {
      onCloseMenu?.();
    }, 300); // 300ms delay before closing
    setCloseTimeout(timeoutId);
  };

  const handleMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  }, [closeTimeout]);

  return (
    <PopoverContent
      side="right"
      className="w-fit"
      ref={containerRef}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <div className="space-y-2">
        {optionGroups.map((group, index) => (
          <div key={group.label} className="flex flex-col gap-2">
            {index > 0 && <Separator className="my-2" />}
            <h4 className="font-medium leading-none mb-3">{t(group.label)}</h4>
            <RenderOptions
              options={group.options}
              onAddSlide={onAddSlide}
              onCloseMenu={onCloseMenu}
            />
          </div>
        ))}
      </div>
    </PopoverContent>
  );
}
