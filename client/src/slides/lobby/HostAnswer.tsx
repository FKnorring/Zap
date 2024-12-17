import { LobbySlide, Participant } from '@/models/Quiz';
import { Preview } from './Preview';

export function HostAnswer({
  slide,
  participants,
  onNextSlide,
  quizCode,
}: {
  slide: LobbySlide;
  participants: Participant[];
  onNextSlide: () => void;
  quizCode: string;
}) {
  return (
    <Preview
      slide={slide}
      participants={participants}
      onNextSlide={onNextSlide}
      quizCode={quizCode}
    />
  );
}
