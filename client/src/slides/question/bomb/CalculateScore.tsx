import { BombSlide } from '@/models/Quiz';
import { CalculateScoreProps } from '@/slides';

export function CalculateScore({
  slide,
  participants,
}: CalculateScoreProps<BombSlide>): number[] {
  const totalPoints = slide.points; // Full points for the highest answer

  // The number of participants

  // Get the answers from participants, parse them as numbers, and find the highest answer
  const answers = participants
    .map((participant) => {
      const latestAnswer = participant.answers?.at(-1)?.answer[0]; // Get the last answer in the array
      return latestAnswer ? parseInt(latestAnswer) : null;
    })
    .filter((answer) => answer !== null); // Filter out any null values

  console.log(answers);

  // Find the highest answer
  const highestAnswer = Math.max(...answers);

  // Return the scores for each participant based on their answer
  return participants.map((participant) => {
    const latestAnswer = participant.answers?.at(-1)?.answer[0]; // Get the last answer in the array
    const answerValue = latestAnswer ? parseInt(latestAnswer) : 0;

    // If the participant has the highest answer, give full points (1000)
    if (answerValue === highestAnswer) {
      return totalPoints;
    } else if (answerValue === highestAnswer - 1) {
      return totalPoints / 2;
    } else {
      return 0;
    }
    // Otherwise, calculate the proportional points based on their answer
  });
}
