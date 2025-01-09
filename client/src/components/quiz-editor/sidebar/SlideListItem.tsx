import type { Slide } from '@/models/Quiz';
import { SlidePreview } from '../SlidePreview';
import { SlideActions } from './SlideActions';
import { getSlideComponents } from '@/slides/utils';
import { useTranslation } from 'react-i18next';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSlideSidebarContext } from './SlideSidebarContext';

interface SlideListItemProps {
  slide: Slide;
  index: number;
  totalSlides: number;
}

export function SlideListItem({
  slide,
  index,
  totalSlides,
}: SlideListItemProps) {
  const { t } = useTranslation(['questions']);
  const slideComponent = getSlideComponents(slide);
  const {
    activeSlideId,
    onSlideSelect,
    backgroundColor,
    primaryColor,
    secondaryColor,
  } = useSlideSidebarContext();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      id={index === 0 ? 'first-slide' : undefined}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group cursor-grab active:cursor-grabbing mb-2"
      onClick={() => onSlideSelect(slide.id)}
      tabIndex={0}
      role="button"
      aria-selected={activeSlideId === slide.id}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSlideSelect(slide.id);
        }
      }}
    >
      <div>
        <div className="flex flex-row space-x-2  text-md  items-center">
          <slideComponent.Info.icon
            className="text-black"
            size={16}
            strokeWidth={3}
            color={slideComponent.Info.iconColor}
          />
          <h1 className="font-display text-black ">
            {t(slideComponent.Info.label)}
          </h1>
        </div>
        <div
          className={`cursor-pointer rounded overflow-hidden ${
            activeSlideId === slide.id ? ' bg-primary/60 ' : ''
          }`}
        >
          <div className="flex flex-row items-center p-2 ">
            <h1 className="text-black rounded-full font-display text-sm  mr-2">
              {index + 1}
            </h1>
            <SlidePreview
              slide={slide}
              backgroundColor={backgroundColor}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />
          </div>
        </div>

        <SlideActions
          index={index}
          totalSlides={totalSlides}
          slideId={slide.id}
        />
      </div>
    </div>
  );
}
