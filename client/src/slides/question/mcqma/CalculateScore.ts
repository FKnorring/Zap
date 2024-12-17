import { MCQMASlide } from '@/models/types/questions';

import { CalculateScoreProps } from '@/slides';

export function CalculateScore({
  slide,
  participants,
}: CalculateScoreProps<MCQMASlide>): number[] {
  const { options } = slide;
  return participants.map((participant) => {
    const latestAnswer = participant.answers?.at(-1)?.answer;
    const correctOptions = options
      .filter((option) => option.isCorrect)
      .map((option) => option.text);

    if (!latestAnswer || correctOptions.length != latestAnswer.length) return 0;

    const correctAnswerSet = new Set(correctOptions);
    const userAnswerSet = new Set(latestAnswer);

    return [...correctAnswerSet].every((answer) => userAnswerSet.has(answer)) &&
      [...userAnswerSet].every((answer) => correctAnswerSet.has(answer))
      ? slide.points
      : 0;
  });
}
