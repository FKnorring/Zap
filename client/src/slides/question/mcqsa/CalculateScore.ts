import { MCQSASlide } from "@/models/Quiz";
import { CalculateScoreProps } from "@/slides";

export function CalculateScore({
  slide,
  participants,
}: CalculateScoreProps<MCQSASlide>): number[] {
  const { options } = slide;
  return participants.map((participant) => {
    const latestAnswer = participant.answers?.at(-1)?.answer;
    if (!latestAnswer) return 0;
    return options.find((option) => option.isCorrect)?.text === latestAnswer[0] ? slide.points : 0;
  });
}
