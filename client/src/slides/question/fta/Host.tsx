import { FTASlide } from "@/models/Quiz";
import NextSlide from "@/slides/_components/NextSlide";

export function Host({
  slide,
  onNextSlide,
}: {
  slide: FTASlide;
  onNextSlide: () => void;
}) {
  return (
    <div className="flex flex-col items-center">
      {/* Slide Title */}
      <div className="bg-white rounded p-4 mb-10 mt-20 text-wrap text-center">
        <h1 className="text-4xl text-black font-display">{slide.title}</h1>
      </div>

      <NextSlide onClick={onNextSlide} />
    </div>
  );
}
