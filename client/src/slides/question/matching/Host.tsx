import { MatchingSlide } from '@/models/Quiz';
import { BaseQuestionRender } from '../base/QuestionRender';
import { getColor } from '../base/QuizColors';
import NextSlide from '@/slides/_components/NextSlide';

export function Host({
  slide,
  onNextSlide,
}: {
  slide: MatchingSlide;
  onNextSlide: () => void;
}) {
  return (
    <>
      <BaseQuestionRender slide={slide}>
        <div className="flex flex-col flex-1 justify-center items-center px-64 gap-8">
          {slide.labels.map((label, idx) => (
            <div
              key={label.id}
              style={{ backgroundColor: getColor(idx) }}
              className="p-8 rounded-lg flex items-center justify-center min-w-96 w-fit"
            >
              <h3 className="text-7xl font-bold">{label.text}</h3>
            </div>
          ))}
        </div>
      </BaseQuestionRender>
      <NextSlide onClick={onNextSlide} />
    </>
  );
}
