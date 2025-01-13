import { ClosestSlide, Participant } from '@/models/Quiz';
import SlideTitleSpecial from '@/slides/_components/SlideTitleSpecial';
import { Target } from 'lucide-react';
import NextSlide from '@/slides/_components/NextSlide';

interface HostProps {
  slide: ClosestSlide;
  participants: Participant[];
  removeParticipant: (participantId: string) => void;
  onNextSlide: () => void;
  onPrevSlide: () => void;
  endQuiz: (quizCode: string) => Promise<boolean>;
  quizCode: string;
}

export function Host({
  slide,
  onNextSlide,
  onPrevSlide,
  endQuiz,
  quizCode,
}: HostProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center p-8 space-y-5 bg-white rounded-lg">
        <SlideTitleSpecial title={slide.title} icon={Target} />
      </div>

      <NextSlide
        quizCode={quizCode}
        endQuiz={() => endQuiz(quizCode)} // Corrected here
        onPrev={onPrevSlide}
        onNext={onNextSlide}
      />
    </div>
  );
}
