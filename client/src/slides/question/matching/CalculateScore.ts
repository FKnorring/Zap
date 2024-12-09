import { MatchingSlide } from "@/models/types/questions";
import { CalculateScoreProps } from "@/slides";

export function CalculateScore({
  slide,
  participants,
}: CalculateScoreProps<MatchingSlide>): number[] {
  const { labels } = slide;
  return participants.map((participant) => {
    const latestAnswer = participant.answers?.at(-1)?.answer;
    if (!latestAnswer) return 0;
    return labels.every((label) => label.correctOptions.every((option) =>
      (latestAnswer as unknown as Record<string, string[]>)[label.id]?.includes(option)
    )) ? slide.points : 0;
  });
}
