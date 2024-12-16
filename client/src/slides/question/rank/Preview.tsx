import { Participant, RankSlide } from '@/models/Quiz';
import { BaseQuestionRender } from '@/slides/question/base/QuestionRender';
import SlideRank from '@/slides/_components/SlideRank';

export function Preview({
  slide,
}: {
  slide: RankSlide;
  participants: Participant[];
}) {
  return (
    <BaseQuestionRender slide={slide}>
      <SlideRank ranking={slide.ranking} answers={[]} />
    </BaseQuestionRender>
  );
}
