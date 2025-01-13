import { Participant } from "@/models/types/participants";

interface MatchGroupProps {
  title: string;
  options: string[];
  answers: { answer: Record<string, string[]>, participant: Participant }[];
  labelId: string;
  totalParticipants: number;
  background: string;
}

export default function MatchGroup({
  title,
  options,
  answers,
  labelId,
  totalParticipants,
  background,
}: MatchGroupProps) {
  return (
    <div
      className="p-4 rounded-lg flex flex-col items-center justify-center gap-2"
      style={{ backgroundColor: background }}
    >
      <h3 className="text-2xl font-bold font-display">{title}</h3>
      <ul className="flex flex-col gap-2 w-full">
        {options && options.map((option) => {
          // Count how many participants got this option correct in this label
          const correctCount = answers.filter((answer) => {
            const answerObj = answer.answer as Record<string, string[]>;
            if (labelId === "unassigned") {
              // For unassigned, it's correct if the option is in unassigned and should be there
              return answerObj.unassigned?.includes(option);
            } else {
              // For labels, it's correct if the option is in the right label
              return answerObj[labelId]?.includes(option);
            }
          }).length;

          return (
            <li
              key={option}
              className="bg-card text-black p-2 px-3 rounded flex justify-between items-center"
            >
              <span>{option}</span>
              <span className="text-sm font-medium">
                {correctCount}/{totalParticipants}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}