import { Preview } from './Preview';
import { ScoreSlide } from '@/models/Quiz';
import { Confetti } from '@/components/particles/Confetti';
import NextSlide from '../_components/NextSlide';

export function HostAnswer({
  slide,
  onNextSlide,
}: {
  slide: ScoreSlide;
  onNextSlide: () => void;
}) {
  return (
    <div>
      <Confetti delayProp={5000} />
      <Preview slide={slide} />
      <NextSlide onClick={onNextSlide} />
    </div>
  );
}
