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

    const answer = latestAnswer as unknown as Record<string, string[]>;
    
    // Count total correct options across all labels
    const totalCorrectOptions = labels.reduce((sum, label) => 
      sum + label.correctOptions.length, 0);

    // Count how many correct options the participant matched
    const correctMatches = labels.reduce((sum, label) => {
      const participantAnswers = answer[label.id] || [];
      const correctlyMatched = label.correctOptions.filter(option => 
        participantAnswers.includes(option)
      ).length;
      return sum + correctlyMatched;
    }, 0);

    // Check unassigned options - they should not be in any correct answers
    const unassignedAnswers = answer.unassigned || [];
    const incorrectlyUnassigned = unassignedAnswers.filter(option => 
      labels.some(label => label.correctOptions.includes(option))
    ).length;

    // Subtract points for incorrectly unassigned options
    const finalScore = Math.max(0, (correctMatches - incorrectlyUnassigned) / totalCorrectOptions) * slide.points;
    return finalScore;
  });
}
