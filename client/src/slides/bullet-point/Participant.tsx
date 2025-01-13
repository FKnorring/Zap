import { BulletPointSlide } from "@/models/Quiz";
import { Render } from "./Render";

export function Participant({ slide }: { slide: BulletPointSlide }) {
    return <Render slide={slide} />;
} 