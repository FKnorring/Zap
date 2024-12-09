import { RankSlide } from "@/models/Quiz";
import { CalculateScoreProps } from "@/slides";

export function CalculateScore({
  slide,
  participants,
}: CalculateScoreProps<RankSlide>): number[] {
  const { ranking } = slide;
  return participants.map((participant) => {
    const latestAnswer = participant.answers?.at(-1)?.answer;
    if (!latestAnswer) return 0;
    return ranking.every((rank, index) => rank === latestAnswer[index]) ? slide.points : 0;
  });
}
