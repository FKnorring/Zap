import { FTASlide } from "@/models/Quiz";
import { BaseQuestionRender } from "@/slides/question/base/QuestionRender";

export function Preview({
  slide,
}: {
  slide: FTASlide;
}) {
  return <BaseQuestionRender slide={slide} />;
}
