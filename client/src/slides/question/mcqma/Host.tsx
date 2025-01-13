import { MCQMASlide } from '@/models/Quiz';
import { BaseQuestionRender } from '../base/QuestionRender';
import NextSlide from '@/slides/_components/NextSlide';
import RenderOptions from '../base/RenderOptions';

export function Host({
  slide,
  onNextSlide,
  onPrevSlide,
  endQuiz,
  quizCode,
}: {
  slide: MCQMASlide;
  onNextSlide: () => void;
  onPrevSlide: () => void;
  endQuiz: (quizCode: string) => void;
  quizCode: string;
}) {
  return (
    <BaseQuestionRender slide={slide}>
      <div className="flex flex-col items-center justify-center p-10">
        <RenderOptions slide={slide} />
        <NextSlide
          quizCode={quizCode}
          endQuiz={() => endQuiz(quizCode)}
          onPrev={onPrevSlide}
          onNext={onNextSlide}
        />
      </div>
    </BaseQuestionRender>
  );
}
