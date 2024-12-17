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
      <h1 className="font-bold text-black text-sm mb-1">
        {index + 1}. {t(slideComponent.Info.label)}
      </h1>
      <div className={`cursor-pointer rounded overflow-hidden ${
        activeSlideId === slide.id
          ? 'border-2 border-primary ring-2 ring-primary'
          : 'border border-gray-200 hover:border-primary/50'
      }`}>
        <SlidePreview
          slide={slide}
          backgroundColor={backgroundColor}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />
      </div>

      <SlideActions
        index={index}
        totalSlides={totalSlides}
        slideId={slide.id}
      />
    </div>
  );
} 