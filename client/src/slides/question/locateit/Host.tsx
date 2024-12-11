import { LocateItSlide, Participant } from '@/models/Quiz';
import { ParticipantAnswers } from '@/slides/_components/ParticipantAnswers';
import markerIcon from '@/assets/markerIcon.png';
import NextSlide from '@/slides/_components/NextSlide';

export function Host({
  slide,
  participants = [],
  onNextSlide,
}: {
  slide: LocateItSlide;
  participants: Participant[];
  onNextSlide: () => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white rounded p-4 mb-10 mt-20 text-wrap text-center flex-row flex items-center">
        <img
          src={markerIcon}
          alt="Marker Icon"
          className="w-20 h-20 rounded-full "
        />
        <h1 className="text-5xl text-black font-display">{slide.title}</h1>
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
      <ParticipantAnswers participants={participants} />
      <NextSlide onClick={onNextSlide} />
    </div>
  );
}
