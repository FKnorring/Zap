import { BulletPointSlide } from "@/models/Quiz";
import { Render } from "./Render";

export function ParticipantAnswer({ slide }: { slide: BulletPointSlide }) {
    return <Render slide={slide} />;
} 