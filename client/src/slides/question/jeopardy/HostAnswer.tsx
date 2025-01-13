import { JeopardySlide, Participant } from "@/models/Quiz";
import { cn } from "@/lib/utils";

interface Props {
  slide: JeopardySlide;
  participants: Participant[];
}

export function HostAnswer({ slide, participants }: Props) {
  // Sort participants by score in descending order
  const sortedParticipants = [...participants].sort((a, b) => {
    const scoreA = parseInt(a.answers.find(ans => ans.slideNumber === parseInt(slide.id))?.answer[0] || "0");
    const scoreB = parseInt(b.answers.find(ans => ans.slideNumber === parseInt(slide.id))?.answer[0] || "0");
    return scoreB - scoreA;
  });

  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-white p-8">
      <h1 className="text-6xl font-bold mb-12">Final Scores</h1>
      <div className="flex flex-col gap-6 items-center">
        {sortedParticipants.map((participant, index) => {
          const score = parseInt(participant.answers.find(ans => ans.slideNumber === parseInt(slide.id))?.answer[0] || "0");
          return (
            <div 
              key={participant.participantId}
              className={cn(
                "flex items-center gap-4 text-4xl font-bold",
                index === 0 && "text-[#FFD700]", // Gold for 1st place
                index === 1 && "text-[#C0C0C0]", // Silver for 2nd place
                index === 2 && "text-[#CD7F32]"  // Bronze for 3rd place
              )}
            >
              <span className="w-8">{index + 1}.</span>
              <span className="w-48">{participant.name}</span>
              <span className="text-[#F3A22E]">${score}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 