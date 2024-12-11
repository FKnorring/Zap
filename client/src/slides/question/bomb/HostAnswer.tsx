import { BombSlide, Participant } from '@/models/Quiz';
import NextSlide from '@/slides/_components/NextSlide';

export function HostAnswer({
  onNextSlide,
}: {
  slide: BombSlide;
  participants: Participant[];
  onNextSlide: () => void;
}) {
  return (
    <div className="flex flex-col items-center h-full p-10 w-full">
      <NextSlide onClick={onNextSlide} />
    </div>
  );
}
