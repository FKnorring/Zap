import { MatchingSlide } from '@/models/Quiz';

import { getColor } from '../base/QuizColors';
import NextSlide from '@/slides/_components/NextSlide';
import { Smartphone } from 'lucide-react';

export function Host({
  slide,
  onNextSlide,
  onPrevSlide,
  endQuiz,
  quizCode,
}: {
  slide: MatchingSlide;
  onNextSlide: () => void;
  onPrevSlide: () => void;
  endQuiz: (quizCode: string) => Promise<boolean>;
  quizCode: string;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-center pt-32 mb-10 ">
        <h1 className="font-display text-8xl">{slide.title}</h1>
      </div>
      <div className="flex flex-row flex-1 justify-center items-center  gap-8">
        {slide.labels.map((label, idx) => (
          <div
            key={label.id}
            style={{ backgroundColor: getColor(idx) }}
            className="p-8 rounded-lg flex items-center justify-center min-w-96 w-fit"
          >
            <h3 className="text-7xl font-bold font-display">{label.text}</h3>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center">
        <Smartphone size={256} color="white" className="mt-10"></Smartphone>'
      </div>
      '
      <NextSlide
        quizCode={quizCode}
        endQuiz={() => endQuiz(quizCode)} // Corrected here
        onPrev={onPrevSlide}
        onNext={onNextSlide}
      />
    </div>
  );
}
