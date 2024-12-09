import { FTASlide } from "@/models/types/questions";
import { CalculateScoreProps } from "@/slides";

export function CalculateScore({
  slide,
  participants,
}: CalculateScoreProps<FTASlide>): number[] {
  return participants.map((participant) => {
    const latestAnswer = participant.answers.at(-1)?.answer;
    if (!latestAnswer) return 0;
    return latestAnswer[0] === slide.correctAnswer ? slide.points : 0;
  });
}
