import { Participant, MatchingSlide } from "@/models/Quiz";
import NextSlide from "@/slides/_components/NextSlide";
import { SlideTitle } from "@/slides/_components/SlideTitle";
import { getColor } from "../base/QuizColors";
import { cn } from "@/lib/utils";
import MatchGroup from "./MatchGroup";



export function HostAnswer({
  slide,
  onNextSlide,
}: {
  slide: MatchingSlide;
  participants: Participant[];
  onNextSlide: () => void;
}) {
  const unAssignedOptions = slide.options.filter((option) => !slide.labels.some((label) => label?.correctOptions?.includes(option)));

  const cols = slide.labels.length + (unAssignedOptions.length > 0 ? 1 : 0);

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8">
      <SlideTitle title={slide.title} />
      <div className={cn("w-full grid grid-cols-2 gap-8 px-16", cols == 3 && "grid-cols-3", cols == 4 && "grid-cols-4")}>
        {slide.labels.map((label, idx) => (
          <MatchGroup
            key={label.id}
            title={label.text}
            options={label.correctOptions}
            background={getColor(idx)}
          />
        ))}
        {unAssignedOptions.length > 0 && (
          <MatchGroup
            title="No Match!"
            options={unAssignedOptions}
            background="rgb(107 114 128)"
          />
        )}
      </div>
      <NextSlide onClick={onNextSlide} />
    </div>
  );
} 