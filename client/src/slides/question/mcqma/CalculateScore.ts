import { MCQMASlide } from "@/models/types/questions";

import { CalculateScoreProps } from "@/slides";

export function CalculateScore({
  slide,
  participants,
}: CalculateScoreProps<MCQMASlide>): number[] {
  const { options } = slide;
  return participants.map((participant) => {
    const latestAnswer = participant.answers?.at(-1)?.answer;
    if (!latestAnswer) return 0;
    return options.filter((option) => option.isCorrect).every((option) => latestAnswer.includes(option.text)) ? slide.points : 0;
  });
}
