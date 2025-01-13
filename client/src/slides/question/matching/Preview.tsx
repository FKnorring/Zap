import { MatchingSlide } from "@/models/Quiz";
import { BaseQuestionRender } from "../base/QuestionRender";
import { getColor } from "../base/QuizColors";
import { cn } from "@/lib/utils";
import MatchGroup from "./MatchGroup";

export function Preview({ slide }: { slide: MatchingSlide }) {

  const unAssignedOptions = slide.options.filter((option) => !slide.labels.some((label) => label?.correctOptions?.includes(option)));

  const cols = slide.labels.length + (unAssignedOptions.length > 0 ? 1 : 0);
  return (
    <div>
      <BaseQuestionRender slide={slide}>
      <div className={cn("w-full grid grid-cols-2 gap-8 p-16 ", cols == 3 && "grid-cols-3", cols == 4 && "grid-cols-4")}>
        {slide.labels.map((label, idx) => (
          <MatchGroup
            key={label.id}
            title={label.text}
            options={label.correctOptions}
            background={getColor(idx)}
            answers={[]}
            labelId={label.id}
            totalParticipants={0}
          />
        ))}
        {unAssignedOptions.length > 0 && (
          <MatchGroup
            title="No Match!"
            options={unAssignedOptions}
            background="rgb(107 114 128)"
            answers={[]}
            labelId="unassigned"
            totalParticipants={0}
          />
        )}
      </div>
      </BaseQuestionRender>
    </div>
  );
} 