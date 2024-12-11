import { MCQMASlide } from '@/models/types/questions';

import { CalculateScoreProps } from '@/slides';

export function CalculateScore({
  slide,
  participants,
}: CalculateScoreProps<MCQMASlide>): number[] {
  const { options } = slide;
  return participants.map((participant) => {
    const latestAnswer = participant.answers?.at(-1)?.answer;
    const correctOptions = options.filter((option) => option.isCorrect);
    if (!latestAnswer || correctOptions.length != latestAnswer.length) return 0;
    return correctOptions.every((option) => latestAnswer.includes(option.text))
      ? slide.points
      : 0;
  });
}
