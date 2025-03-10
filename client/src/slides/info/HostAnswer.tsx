import { InfoSlide } from '@/models/Quiz';
import NextSlide from '../_components/NextSlide';
import { Render } from './Render';

export function HostAnswer({
  slide,
  onNextSlide,
  onPrevSlide,
  endQuiz,
  quizCode,
}: {
  slide: InfoSlide;
  onNextSlide: () => void;
  onPrevSlide: () => void;
  endQuiz: (quizCode: string) => Promise<boolean>;
  quizCode: string;
}) {
  return (
    <div className="flex-1 flex flex-col">
      <Render slide={slide} />
      <NextSlide
        quizCode={quizCode}
        endQuiz={() => endQuiz(quizCode)} // Corrected here
        onPrev={onPrevSlide}
        onNext={onNextSlide}
      />
    </div>
  );
}
