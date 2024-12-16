import { LobbySlide, Participant } from "@/models/Quiz";
import Render from "./Render";

export function Host({
  slide,
  participants,
  onNextSlide,
  removeParticipant,
  quizCode,
}: {
  slide: LobbySlide;
  participants: Participant[];
  onNextSlide: () => void;
  removeParticipant: (participantId: string) => void;
  quizCode: string;
}) {
  return (
    <Render
      slide={slide}
      participants={participants}
      onNextSlide={onNextSlide}
      quizCode = {quizCode}
      removeParticipant={removeParticipant}
    />
  );
}
