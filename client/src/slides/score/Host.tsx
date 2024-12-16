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
  slide,
}: {
  participants: Participant[];
  slides: Slide[];
  currentSlide: number;
  onNextSlide: () => void;
  slide: ScoreSlide;
}) {
  const SlideComponent = getSlideComponents(slide);
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white rounded p-4 mb-10 mt-20 text-wrap text-center flex-row flex items-center">
        <SlideTitleSpecial
          title={slide.title}
          icon={SlideComponent.Info.icon}
        />
      </div>
      <Confetti delayProp={5000} />
      <ScoreBoard
        currentSlide={currentSlide}
        slides={slides}
        participants={participants}
      />
      <NextSlide onClick={onNextSlide} />
    </div>
  );
}
