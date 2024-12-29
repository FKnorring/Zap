import { BulletPointSlide } from "@/models/Quiz";
import { Render } from "./Render";

export function Preview({ slide }: { slide: BulletPointSlide }) {
    return <Render slide={slide} />;
} 