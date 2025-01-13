import { MatchingSlide } from "@/models/types/questions";
import { CalculateScoreProps } from "@/slides";

export function CalculateScore({
  slide,
  participants,
}: CalculateScoreProps<MatchingSlide>): number[] {
  const { labels, options } = slide;
  
  return participants.map((participant) => {
    const latestAnswer = participant.answers?.at(-1)?.answer;
    if (!latestAnswer) return 0;

    const answer = latestAnswer as unknown as Record<string, string[]>;

    // Total options (labels only)
    const totalOptions = options.length;

    // Correct matches in assigned categories
    const correctAssignedMatches = labels.reduce((sum, label) => {
      const participantAnswers = answer[label.id] || [];
      const correctlyMatched = label.correctOptions.filter((option) =>
        participantAnswers.includes(option)
      ).length;
      return sum + correctlyMatched;
    }, 0);

    // Track unassigned options
    const assignedOptions = labels.flatMap((label) => label.correctOptions);
    const unassignedOptions = options.filter((option) => !assignedOptions.includes(option));

    // Check if unassigned options are marked as correct under "None of the Others"
    const correctUnassignedMatches = unassignedOptions.reduce((sum, option) => {
      const participantAnswers = Object.values(answer).flat();
      if (participantAnswers.includes(option)) {
        sum += 1; // This is a correct answer under "None of the Others"
      }
      return sum;
    }, 0);

    // Debugging logs
    console.log({
      participant: participant.participantId,
      totalOptions,
      correctAssignedMatches,
      correctUnassignedMatches,
      slidelabels: slide.labels,
      slideoptions: slide.options,
      calculatedFraction: (correctAssignedMatches + correctUnassignedMatches) / totalOptions,
    });

    // Final score, taking into account both assigned and unassigned matches
    const finalScore = Math.floor(
      ((correctAssignedMatches + correctUnassignedMatches) / totalOptions) * slide.points
    );

    return Math.max(0, finalScore); // Ensure score is non-negative
  });
}
