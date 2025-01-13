import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { type Quiz } from '@/models/Quiz';
import { useTranslation } from 'react-i18next';
import { SlidePreview } from '../quiz-editor/SlidePreview';
import { useState } from 'react';
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react';

interface QuizPreviewProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  quiz: Quiz;
}

export function QuizPreview({ isOpen, setIsOpen, quiz }: QuizPreviewProps) {
  const { t } = useTranslation(['quizEditor']);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleNextSlide = () => {
    if (currentSlideIndex < quiz.slides.length - 1) {
      setCurrentSlideIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleQuit = () => {
    setIsOpen(false);
  };

  if (!quiz || !quiz.slides) {
    setIsOpen(false);
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[60%] min-w-[60%] h-fit text-black ">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="!font-normal font-display text-3xl">
                {quiz.quiz_name}
              </DialogTitle>
              <DialogDescription className="font-display text-md">
                {t('preview.description')}
              </DialogDescription>
            </div>
            <div className="text-xl text-muted-foreground w-20 bg-gray-200 rounded-full p-1 text-center mr-4 flex items-center justify-center font-display">
              {currentSlideIndex + 1} / {quiz.slides.length}
            </div>
          </div>
        </DialogHeader>
        <div className="grid gap-4 text-white pointer-events-none">
          <SlidePreview
            slide={quiz.slides[currentSlideIndex]}
            whichPreview="Host"
            backgroundColor={quiz.settings.backgroundColor}
            primaryColor={quiz.settings.primaryColor}
            secondaryColor={quiz.settings.secondaryColor}
          />
        </div>
        <DialogFooter className="flex justify-between">
          <Button
            disabled={currentSlideIndex === 0}
            onClick={handlePreviousSlide}
            className="font-display text-xl select-none"
          >
            <ArrowBigLeft />
            {t('preview.back')}
          </Button>
          <Button
            disabled={currentSlideIndex === quiz.slides.length - 1}
            onClick={handleNextSlide}
            className="font-display text-xl select-none"
          >
            {t('preview.next')}
            <ArrowBigRight />
          </Button>
          <Button
            variant="destructive"
            onClick={handleQuit}
            className="font-display text-xl select-none"
          >
            {t('preview.leave')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
