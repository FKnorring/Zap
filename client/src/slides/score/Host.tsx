import { Confetti } from "@/components/particles/Confetti";
import { Participant, Slide } from "@/models/Quiz";

import ScoreBoard from "@/slides/_components/Scoreboard";
import NextSlide from "../_components/NextSlide";

export function Host({
  participants,
  slides,
  currentSlide,
  onNextSlide,
}: {
  participants: Participant[];
  slides: Slide[];
  currentSlide: number;
  onNextSlide: () => void;
}) {
  return (
    <div>
      <Confetti />
      <ScoreBoard
        currentSlide={currentSlide}
        slides={slides}
        participants={participants}
      />
      <NextSlide onClick={onNextSlide} />
    </div>
  );
}
