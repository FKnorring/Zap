import { FTASlide, Participant } from "@/models/Quiz";
import { ParticipantAnswers } from "@/slides/_components/ParticipantAnswers";
import NextSlide from "@/slides/_components/NextSlide";

export function Host({
  slide,
  participants,
  onNextSlide,
}: {
  slide: FTASlide;
  participants: Participant[];
  onNextSlide: () => void;
}) {
  return (
    <div className="flex flex-col items-center">
      {/* Slide Title */}
      <div className="bg-white rounded p-4 mb-10 mt-20 text-wrap text-center">
        <h1 className="text-4xl text-black font-display">{slide.title}</h1>
      </div>
      <ParticipantAnswers participants={participants} />

      <NextSlide onClick={onNextSlide} />
    </div>
  );
}
