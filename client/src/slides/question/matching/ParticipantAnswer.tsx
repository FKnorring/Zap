import { Participant, MatchingSlide } from "@/models/Quiz";
import RenderCorrectIncorrect from "../base/RenderCorrectIncorrect";
import { getColor } from "../base/QuizColors";
import { cn } from "@/lib/utils";
import { Check, X } from 'lucide-react';

export function ParticipantAnswer({
  slide,
  participant,
}: {
  slide: MatchingSlide;
  participant: Participant;
}) {
  const latestAnswer = participant.answers?.at(-1);
  if (!latestAnswer) return null;

  const answer = latestAnswer.answer as unknown as Record<string, string[]>;
  const cols = slide.labels.length;

  return (
    <RenderCorrectIncorrect participant={participant}>
      <div className="mb-4">
        <div className={cn("w-full grid grid-cols-2 gap-4", cols == 3 && "grid-cols-3", cols == 4 && "grid-cols-4")}>
          {slide.labels.map((label, idx) => {
            const participantAnswers = answer[label.id] || [];
            const correctAnswers = label.correctOptions || [];
            const isCorrect = participantAnswers.map((ans: string) => 
              correctAnswers.includes(ans)
            );
            const bg = getColor(idx);

            return (
              <div key={label.id} className="flex flex-col items-center w-full gap-2">
                <div style={{ backgroundColor: bg }} className="w-full p-4 rounded-lg flex flex-col items-center justify-center gap-2">
                  <h3 className="text-2xl font-bold font-display">{label.text}</h3>
                  <ul className="flex flex-col gap-2">
                    {participantAnswers.map((answer: string, idx: number) => (
                      <li className="bg-card text-black p-1 px-2 rounded flex justify-between items-center" key={answer}>
                        {answer}
                        <span className="ml-1">
                          {isCorrect[idx] ? 
                            <Check className="w-4 h-4 text-green-500" /> : 
                            <X className="w-4 h-4 text-red-500" />}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
          
          <div className="flex flex-col items-center w-full gap-2">
            <div className="w-full p-4 rounded-lg flex flex-col items-center justify-center gap-2 bg-secondary/50">
              <h3 className="text-2xl font-bold font-display">Unassigned</h3>
              <ul className="flex flex-col gap-2">
                {(answer.unassigned || []).map((unassigned: string) => {
                  const shouldBeAssigned = slide.labels.some(
                    label => label.correctOptions.includes(unassigned)
                  );
                  return (
                    <li className="bg-card text-black p-1 px-2 rounded flex justify-between items-center" key={unassigned}>
                      {unassigned}
                      <span className="ml-1">
                        {!shouldBeAssigned ? 
                          <Check className="w-4 h-4 text-green-500" /> : 
                          <X className="w-4 h-4 text-red-500" />}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </RenderCorrectIncorrect>
  );
} 