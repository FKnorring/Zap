import { useRef } from 'react';
import { PopoverContent } from '@/components/ui/popover';
import { type SlideType, type QuestionType, SlideTypes } from '@/models/Quiz';
import * as Slides from '@/slides';
import { SlideInfo } from '@/slides';
import { useTranslation } from 'react-i18next';
import { SlideOption } from './SlideOption';

interface SlideCreationMenuProps {
  onAddSlide: (
    type: SlideType,
    questionType?: QuestionType,
    index?: number
  ) => void;
  onCloseMenu?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
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
  onAddSlide: (
    type: SlideType,
    questionType?: QuestionType,
    index?: number
  ) => void;
  onCloseMenu?: () => void;
}

function RenderOptions({
  options,
  onAddSlide,
  onCloseMenu,
}: RenderOptionsProps) {
  const {  t} = useTranslation(['questions']);

  const groupedOptions = options.reduce<SlideInfo[][]>(
    (groups, option, index) => {
      if (index % 2 === 0) {
        groups.push([option]);
      } else {
        groups[groups.length - 1].push(option);
      }
      return groups;
    },
    []
  );

  return (
    <div className="grid grid-cols-1 gap-2">
      {groupedOptions.map((group, groupIndex) => (
        <div key={`group-${groupIndex}`} className="grid grid-cols-2 gap-2">
          {group.map((option) => (
            <SlideOption
              key={option.value}
              label={t(option.label)}
              icon={option.icon}
              iconColor={option.iconColor}
              onClick={() => {
                onAddSlide(option.slideType, option.questionType);
                onCloseMenu?.();
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SlideCreationMenu({
  onAddSlide,
  onCloseMenu,
  onMouseEnter,
  onMouseLeave,
}: SlideCreationMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(['quizEditor']);

  return (
    <PopoverContent
      id="slide-creation-menu"
      side="right"
      className="w-fit mb-4"
      ref={containerRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="grid grid-cols-1 gap-6 p-2">
        {optionGroups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <h4 className="font-display text-xl leading-none">
              {t(group.label)}
            </h4>
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
