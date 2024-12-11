import { Preview } from "./Preview";
import { InfoSlide } from "@/models/Quiz";
import NextSlide from "../_components/NextSlide";

export function HostAnswer({
  slide,
  onNextSlide,
}: {
  slide: InfoSlide;
  onNextSlide: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col">
      <Preview slide={slide} />
      <NextSlide onClick={onNextSlide} />
    </div>
  );
}
