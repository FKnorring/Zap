import { Participant, RankSlide } from '@/models/Quiz';
import SlideRank from '@/slides/_components/SlideRank';
import NextSlide from '@/slides/_components/NextSlide';
import { getSlideComponents } from '@/slides/utils';
import SlideTitleSpecial from '@/slides/_components/SlideTitleSpecial';

export function HostAnswer({
  slide,
  participants,
  onNextSlide,
  onPrevSlide,
  endQuiz,
  quizCode,
}: {
  slide: RankSlide;
  participants: Participant[];
  onNextSlide: () => void;
  onPrevSlide: () => void;
  endQuiz: (quizCode: string) => Promise<boolean>;
  quizCode: string;
}) {
  const SlideComponent = getSlideComponents(slide);

  const answers = participants
    ? participants
        .filter(
          (participant) => participant.answers && participant.answers.length > 0
        ) // Only consider participants who have answered
        .map((participant) => {
          return participant.answers[participant.answers.length - 1]; // Get the latest answer
        })
    : [];

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white rounded-md p-4 mb-10 mt-20 text-wrap text-center flex-row flex items-center">
        <SlideTitleSpecial
          title={slide.title}
          icon={SlideComponent.Info.icon}
        />
       
      </div>
      <SlideRank ranking={slide.ranking} answers={answers} />
      
      <NextSlide
        quizCode={quizCode}
        endQuiz={() => endQuiz(quizCode)} // Corrected here
        onPrev={onPrevSlide}
        onNext={onNextSlide}
      />
    </div>
  );
}
