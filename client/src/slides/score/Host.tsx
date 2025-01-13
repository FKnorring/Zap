import { Confetti } from '@/components/particles/Confetti';
import { Participant, Slide, ScoreSlide } from '@/models/Quiz';

import ScoreBoard from '@/slides/_components/Scoreboard';
import NextSlide from '../_components/NextSlide';
import { getSlideComponents } from '../utils';
import SlideTitleSpecial from '../_components/SlideTitleSpecial';

export function Host({
  participants,
  slides,
  currentSlide,
  onNextSlide,
  onPrevSlide,
  endQuiz,
  quizCode,
  slide,
  inPreview = false,
}: {
  participants: Participant[];
  slides: Slide[];
  currentSlide: number;
  onNextSlide: () => void;
  onPrevSlide: () => void;
  endQuiz: (quizCode: string) => Promise<boolean>;
  quizCode: string;
  slide: ScoreSlide;
  inPreview?: boolean;
}) {
  const SlideComponent = getSlideComponents(slide);
  return (
    <div className="flex flex-col items-center mt-20">
      <div className="bg-white rounded p-4 mb-10 mt-20 text-wrap text-center flex-row flex items-center">
        <SlideTitleSpecial
          title={slide.title}
          icon={SlideComponent.Info.icon}
        />
      </div>
      {!inPreview && <Confetti delayProp={5000} />}
      <ScoreBoard
        currentSlide={currentSlide}
        slides={slides}
        participants={participants}
      />
      <NextSlide
        quizCode={quizCode}
        endQuiz={() => endQuiz(quizCode)} // Corrected here
        onPrev={onPrevSlide}
        onNext={onNextSlide}
      />
    </div>
  );
}
