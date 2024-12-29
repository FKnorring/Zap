import { JeopardySlide, Participant } from "@/models/Quiz";

interface Props {
  slide: JeopardySlide;
  participants: Participant[];
  currentSlideTime?: string;
}

export function CalculateAnswer({ participants }: Props) {
  return participants.map((participant) => ({
    participantId: participant.participantId,
    // Get the answer for this slide from the participant's answers
    score: participant.answers.at(-1)?.answer[0]
  }));
} 