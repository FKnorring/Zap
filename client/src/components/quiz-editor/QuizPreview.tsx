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
import { useEffect } from 'react';

interface QuizPreviewProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  quiz: Quiz;
}

export function QuizPreview({ isOpen, setIsOpen, quiz }: QuizPreviewProps) {
  const { t } = useTranslation(['quizEditor']);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (!quiz || !quiz.slides) {
      setIsOpen(false);
    }
  }, [quiz, setIsOpen]);

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
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[75%] min-w-[75%] h-fit text-black ">
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
        <div className="grid grid-cols-[78%_20%] gap-6 text-white pointer-events-none">
          <div className="grid gap-2 text-white">
            <SlidePreview
              slide={quiz.slides[currentSlideIndex]}
              whichPreview="Host"
              backgroundColor={quiz.settings.backgroundColor}
              primaryColor={quiz.settings.primaryColor}
              secondaryColor={quiz.settings.secondaryColor}
            />
          </div>
          <div className="grid gap-2 text-white justify-center items-center">
            <div className="grid rounded-2xl overflow-hidden border-[12px] border-gray-200 bg-gray-200">
              <div className="grid rounded-xl overflow-hidden">
                <SlidePreview
                  slide={quiz.slides[currentSlideIndex]}
                  whichPreview="Participant"
                  backgroundColor={quiz.settings.backgroundColor}
                  primaryColor={quiz.settings.primaryColor}
                  secondaryColor={quiz.settings.secondaryColor}
                />
              </div>
            </div>
          </div>
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
