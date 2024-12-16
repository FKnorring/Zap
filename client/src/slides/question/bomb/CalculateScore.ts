import { BombSlide } from '@/models/Quiz';
import { CalculateScoreProps } from '@/slides';
// Assuming ParticipantAnswer is defined here

export function CalculateScore({
  slide,
  participants,
}: CalculateScoreProps<BombSlide>): number[] {
  const totalPoints = slide.points; // Full points for the highest answer

  // Extract the last answers from participants
  const lastAnswers = participants
    .map((participant) => {
      const answers = participant.answers || [];
      const lastAnswer = answers.at(-1); // Get the last answer
      if (lastAnswer && lastAnswer.answer.length > 0) {
        return parseInt(lastAnswer.answer[0], 10); // Parse the first value in the answer array
      }
      return null;
    })
    .filter((answer): answer is number => answer !== null); // Ensure only numbers remain

  console.log(lastAnswers, 'Last answers');

  // Find the highest answer from the last answers
  const highestAnswer = lastAnswers.length > 0 ? Math.max(...lastAnswers) : 0;

  console.log(highestAnswer, 'Highest answer');

  // Return the scores for each participant based on their last answer
  return participants.map((participant) => {
    const answers = participant.answers || [];
    const latestAnswerObj = answers.at(-1); // Access the last answer object
    const latestAnswer = latestAnswerObj?.answer[0]; // Access the first value of the answer array
    const answerValue = latestAnswer ? parseInt(latestAnswer, 10) : 0;

    // Assign scores based on the answer value compared to the highest answer
    if (answerValue === highestAnswer) {
      return totalPoints; // Full points for the highest answer
    } else if (answerValue === highestAnswer - 1) {
      return totalPoints / 2; // Half points for one less than the highest
    } else if (answerValue === highestAnswer - 2) {
      return totalPoints / 4; // Quarter points for two less than the highest
    }

    // If the answer doesn't match any scoring criteria, return 0 points
    return 0;
  });
}
