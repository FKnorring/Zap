import { ClosestSlide } from "@/models/types/questions";
import { CalculateScoreProps } from "@/slides";

export function CalculateScore({
  slide,
  participants,
}: CalculateScoreProps<ClosestSlide>): number[] {
  // Get all valid guesses and their differences from correct answer
  const participantDiffs = participants.map(participant => {
    const latestAnswer = participant.answers.at(-1)?.answer[0];
    const guess = latestAnswer ? parseFloat(latestAnswer) : null;
    const diff = guess !== null ? Math.abs(guess - slide.correctAnswer) : Infinity;
    return { participant, diff };
  });

  // Find the smallest difference (best guess)
  const minDiff = Math.min(...participantDiffs.map(p => p.diff));

  // Award points only to the closest guess(es)
  return participants.map(participant => {
    const participantDiff = participantDiffs.find(
      p => p.participant.participantId === participant.participantId
    );
    return participantDiff?.diff === minDiff ? slide.points : 0;
  });
} 