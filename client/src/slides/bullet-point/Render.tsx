import { BulletPointSlide } from '@/models/Quiz';
import { SlideTitle } from '@/slides/_components/SlideTitle';
import { Textarea } from '@/components/ui/textarea';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function Render({
  slide,
  onSlideUpdate,
  isEditable = false,
}: {
  slide: BulletPointSlide;
  onSlideUpdate?: (slide: BulletPointSlide) => void;
  isEditable?: boolean;
}) {
  const { t } = useTranslation();
  const hasImage = slide.imageUrl;

  const [tempPoints, setTempPoints] = useState(slide.points || []);

  const handleTitleChange = (newTitle: string) => {
    onSlideUpdate?.({ ...slide, title: newTitle });
  };

  const handlePointBlur = (index: number) => {
    const updatedPoints = [...slide.points];
    updatedPoints[index] = tempPoints[index];
    onSlideUpdate?.({ ...slide, points: updatedPoints });
  };

  const handlePointChange = (newPoint: string, index: number) => {
    const updatedPoints = [...tempPoints];
    updatedPoints[index] = newPoint;
    setTempPoints(updatedPoints);
  };

  const handleAddPoint = () => {
    const updatedPoints = [...(slide.points || []), ''];
    setTempPoints(updatedPoints);
    onSlideUpdate?.({ ...slide, points: updatedPoints });
  };

  const handleDeletePoint = (index: number) => {
    const updatedPoints = slide.points.filter((_, i) => i !== index);
    setTempPoints(updatedPoints);
    onSlideUpdate?.({ ...slide, points: updatedPoints });
  };

  const handleTextareaResize = (textarea: HTMLTextAreaElement | null) => {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const bulletPointsSection = (
    <div className="flex flex-col justify-center max-w-screen-lg px-8">
      <ul
        className="list-none"
        style={{
          gap: `${slide.pointSpacing}px`,
          fontSize: `${slide.fontSize}px`,
          marginBottom: `${slide.pointSpacing}px`,
        }}
      >
        {tempPoints.map((point, index) => (
          <li
            key={index}
            className="flex items-center w-full justify-center"
            style={{ marginBottom: `${slide.pointSpacing}px` }}
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full mr-2 bg-primary mx-auto mt-2" />
            {isEditable ? (
              <Textarea
                ref={(el) => handleTextareaResize(el)}
                className={`font-display bg-transparent resize-none border-2 border-dashed overflow-hidden w-[10000px] p-0 text-[${slide.fontSize}px] mb-[${slide.pointSpacing}px]`}
                value={tempPoints[index]}
                placeholder="Bullet point"
                onChange={(e) => handlePointChange(e.target.value, index)}
                onBlur={() => handlePointBlur(index)}
                rows={1}
              />
            ) : (
              <span className="font-display">{point}</span>
            )}
            {isEditable && (
              <button
                className="ml-2 text-red-500"
                onClick={() => handleDeletePoint(index)}
              >
                <TrashIcon className="h-10 w-10" strokeWidth={3} />
              </button>
            )}
          </li>
        ))}
      </ul>
      {isEditable && (
        <Button
          className="flex items-center text-white text-4xl font-display p-8 [&_svg]:size-10 w-fit mx-auto"
          onClick={handleAddPoint}
        >
          <PlusIcon className="h-10 w-10 mr-2" />
          {t('quizEditor:addBulletPoint')}
        </Button>
      )}
    </div>
  );

  const imageSection = hasImage && (
    <div className="flex-1 flex justify-center items-center">
      <div className="relative">
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
  );

  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-8 p-8">
      <SlideTitle
        title={slide.title}
        isEditable={isEditable}
        onTitleChange={handleTitleChange}
      />
      <div
        className={`flex ${hasImage ? 'gap-12' : ''} items-center justify-around mt-8`}
      >
        {slide.imagePosition === 'left' ? (
          <>
            {imageSection}
            {bulletPointsSection}
          </>
        ) : (
          <>
            {bulletPointsSection}
            {imageSection}
          </>
        )}
      </div>
    </div>
  );
}
