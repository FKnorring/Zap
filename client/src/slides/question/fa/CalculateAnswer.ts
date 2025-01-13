import { FASlide } from "@/models/types/questions";
import { CalculateScoreProps } from "@/slides";

export function CalculateScore({
  slide,
  participants,
}: CalculateScoreProps<FASlide>): number[] {
  return participants.map((participant) => {
    const latestAnswer = participant.answers.at(-1)?.answer;
    if (!latestAnswer) return 0;
    return latestAnswer[0] == "correct" ? slide.points : latestAnswer[0] == "incorrect" ? -slide.points/2 : 0;

  });
}
