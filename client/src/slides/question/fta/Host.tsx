import { FTASlide } from '@/models/Quiz';
import NextSlide from '@/slides/_components/NextSlide';
import { SlideContent } from '@/slides/_components/SlideContent';
import { SlideTitle } from '@/slides/_components/SlideTitle';

export function Host({
  slide,
  onNextSlide,
  onPrevSlide,
  endQuiz,
  quizCode,
}: {
  slide: FTASlide;
  onNextSlide: () => void;
  onPrevSlide: () => void;
  endQuiz: (quizCode: string) => Promise<boolean>;
  quizCode: string;
}) {
  return (
    <div className="flex flex-col items-center">
      {/* Slide Title */}
      <div className=" p-4 mb-10 mt-20  text-wrap text-center">
        <SlideTitle title={slide.title} />
      </div>
      <div>
        <SlideContent content={slide.content} />
      </div>

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

      <NextSlide
        quizCode={quizCode}
        endQuiz={() => endQuiz(quizCode)} // Corrected here
        onPrev={onPrevSlide}
        onNext={onNextSlide}
      />
    </div>
  );
}
