import { MCQMASlide } from '@/models/Quiz';
import { BaseQuestionRender } from '../base/QuestionRender';
import { getColor } from '../base/QuizColors';
import NextSlide from '@/slides/_components/NextSlide';
import { cn } from '@/lib/utils';

export function Host({
  slide,
  onNextSlide,
}: {
  slide: MCQMASlide;
  onNextSlide: () => void;
}) {
  return (
    <BaseQuestionRender slide={slide}>
      <div className="flex flex-col items-center justify-center p-10">
        <div
          className={cn(
            'grid gap-14',
            slide.options.length > 4 ? 'grid-cols-3' : 'grid-cols-2'
          )}
        >
          {/* Only display 4 options, without any click functionality */}
          {slide.options.map((option, index) => (
            <div
              key={option.id}
              style={{
                backgroundColor: getColor(index), // Get different color for each div. Centrerad text och bredare
              }}
              className="flex items-center justify-center text-5xl text-white font-display h-56 w-[500px] rounded-lg box-border p-8"
            >
              <span>{option.text}</span>
            </div>
          ))}
        </div>
        <NextSlide onClick={onNextSlide} />
      </div>
    </BaseQuestionRender>
  );
}
