import { Participant, RankSlide } from '@/models/Quiz';
import SlideRank from '@/slides/_components/SlideRank';
import NextSlide from '@/slides/_components/NextSlide';
import { getSlideComponents } from '@/slides/utils';
import SlideTitleSpecial from '@/slides/_components/SlideTitleSpecial';

export function HostAnswer({
  slide,
  participants,
  onNextSlide,
}: {
  slide: RankSlide;
  participants: Participant[];
  onNextSlide: () => void;
}) {
  const SlideComponent = getSlideComponents(slide);

  const answers = participants
    ? participants
        .filter((participant) => participant.answers.length > 0) // Only consider participants who have answered
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
        {slide.imageUrl && (
          <div className="flex justify-center">
            <div className="relative flex items-center justify-center">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-auto object-contain"
                style={{
                  height: `${(slide.imageScale || 1) * 400}px`,
                  transition: 'height 0.2s ease-out',
                }}
              />
            </div>
          </div>
        )}
      </div>
      <SlideRank ranking={slide.ranking} answers={answers} />
      <NextSlide onClick={onNextSlide} />
    </div>
  );
}
