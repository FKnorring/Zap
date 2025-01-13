import { InfoSlide } from '@/models/Quiz';
import { SlideTitle } from '@/slides/_components/SlideTitle';
import { SlideContent } from '@/slides/_components/SlideContent';
import EmbeddedVideo from '@/slides/_components/EmbeddedVideo';

export function Render({
  slide,
  isEditable = false,
  onSlideUpdate,
}: {
  slide: InfoSlide;
  isEditable?: boolean;
  onSlideUpdate?: (updatedSlide: InfoSlide) => void;
}) {
  const handleTitleChange = (newTitle: string) => {
    if (onSlideUpdate) {
      onSlideUpdate({ ...slide, title: newTitle });
    }
  };

  const handleContentChange = (newContent: string) => {
    if (onSlideUpdate) {
      onSlideUpdate({ ...slide, content: newContent });
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-8 p-8">
      <SlideTitle
        title={slide.title}
        isEditable={isEditable}
        onTitleChange={handleTitleChange}
      />
      {slide.imageUrl && (
        <div className="flex justify-center">
          <div className="relative flex items-center justify-center">
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="w-auto object-contain"
              style={{
                height: `${(slide.imageScale || 1) * 400}px`,
                transition: 'height 0.2s ease-out',
              }}
            />
          </div>
        </div>
      )}
      <SlideContent
        content={slide.content}
        isEditable={isEditable}
        onContentChange={handleContentChange}
      />
      {slide.embedVideoUrl && <EmbeddedVideo url={slide.embedVideoUrl} />}
    </div>
  );
}
