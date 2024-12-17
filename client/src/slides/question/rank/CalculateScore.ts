import { RankSlide } from '@/models/Quiz';
import { CalculateScoreProps } from '@/slides';

export function CalculateScore({
  slide,
  participants,
}: CalculateScoreProps<RankSlide>): number[] {
  const { ranking } = slide;

  return participants.map((participant) => {
    const latestAnswer = participant.answers?.at(-1)?.answer;
    if (!latestAnswer) return 0;

    // Count the number of correct answers
    const correctAnswers = ranking.reduce((count, rank, index) => {
      return rank === latestAnswer[index] ? count + 1 : count;
    }, 0);

    // Calculate the percentage score
    const percentage = correctAnswers / ranking.length;

    // Return the proportional score
    return Math.round(percentage * slide.points);
  });
}