import { cn } from '@/lib/utils';
import { FTASlide } from '@/models/Quiz';
import { SlideContent } from '@/slides/_components/SlideContent';
import { SlideTitle } from '@/slides/_components/SlideTitle';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';

export function Preview({
  slide,
  onSlideUpdate,
}: {
  slide: FTASlide;
  onSlideUpdate: (slide: FTASlide) => void;
}) {
  const { t } = useTranslation();
  const [tempAnswer, setTempAnswer] = useState(slide.correctAnswer);

  useEffect(() => {
    setTempAnswer(slide.correctAnswer);
  }, [slide.correctAnswer]);

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

  const handleAnswerChange = (newAnswer: string) => {
    if (onSlideUpdate) {
      onSlideUpdate({ ...slide, correctAnswer: newAnswer });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-10 space-y-8 w-full">
      <div className="flex flex-col w-full">
        <SlideTitle
          title={slide.title}
          isEditable={true}
          onTitleChange={handleTitleChange}
        />
      </div>
      <div className="flex flex-col w-full">
        <SlideContent
          content={slide.content}
          isEditable={true}
          onContentChange={handleContentChange}
        />
      </div>

      <div className="flex flex-row items-center bg-white rounded p-4 mb-10 mt-20 text-center space-x-4 w-full max-w-4xl mx-auto">
        <h1 className="whitespace-nowrap text-5xl text-black font-display">
          {t('quizEditor:correctAnswer')} :
        </h1>
        <Textarea
          onChange={(e) => setTempAnswer(e.target.value)} // Update the temporary state
          onBlur={() => handleAnswerChange?.(tempAnswer)} // Save only on blur
          rows={1}
          className={cn(
            'flex-grow text-white p-4 text-5xl md:text-5xl font-display rounded-lg',
            tempAnswer === '' ? 'bg-red-500' : 'bg-green-500'
          )}
          value={tempAnswer}
        />
      </div>
    </div>
  );
}
