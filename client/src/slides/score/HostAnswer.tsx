import { Preview } from './Preview';
import { ScoreSlide } from '@/models/Quiz';
import { Confetti } from '@/components/particles/Confetti';
import NextSlide from '../_components/NextSlide';

export function HostAnswer({
  slide,
  onNextSlide,
  onPrevSlide,
  endQuiz,
  quizCode,
}: {
  slide: ScoreSlide;
  onNextSlide: () => void;
  onPrevSlide: () => void;
  endQuiz: (quizCode: string) => Promise<boolean>;
  quizCode: string;
}) {
  return (
    <div>
      <Confetti delayProp={5000} />
      <Preview slide={slide} />
      <NextSlide
        quizCode={quizCode}
        endQuiz={() => endQuiz(quizCode)} // Corrected here
        onPrev={onPrevSlide}
        onNext={onNextSlide}
      />
    </div>
  );
}
