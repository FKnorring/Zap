import { BulletPointSlide } from "@/models/Quiz";
import { Preview } from "./Preview";
import NextSlide from "../_components/NextSlide";

export function HostAnswer({
    slide,
    onNextSlide,
}: {
    slide: BulletPointSlide;
    onNextSlide: () => void;
}) {
    return (
        <div className="flex-1 flex flex-col">
            <Preview slide={slide} />
            <NextSlide onClick={onNextSlide} />
        </div>
    );
} 