import { LobbySlide, Participant } from "@/models/Quiz";
import Render from "./Render";

export function Preview({
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
    <Render
      slide={slide}
      participants={participants}
      onNextSlide={onNextSlide}
      quizCode={quizCode}
      removeParticipant={() => {}}
    />
  );
}
