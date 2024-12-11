import { MCQSASlide, Participant } from '@/models/Quiz';
import { BaseQuestionRender } from '../base/QuestionRender';
import { getColor } from '../base/QuizColors';
import NextSlide from '@/slides/_components/NextSlide';
import { cn } from '@/lib/utils';

export function Host({
  slide,
  participants,
  onNextSlide,
}: {
  slide: MCQSASlide;
  participants: Participant[];
  onNextSlide: () => void;
}) {
  return (
    <BaseQuestionRender slide={slide} participants={participants}>
      <div className="flex flex-col items-center justify-center p-10">
        <div
          className={cn(
            'grid grid-cols-2 gap-14',
            slide.options.length > 4 && 'grid grid-cols-3 gap-14'
          )}
        >
          {/* Only display 4 options, without any click functionality */}
          {slide.options.map((option, index) => (
            <div
              key={option.id}
              style={{
                backgroundColor: getColor(index), // Get different color for each div. Centrerad text och bredare
              }}
              className="flex items-center justify-center text-5xl text-white font-display h-64 w-[550px] rounded-lg box-border p-8" // Same padding and box-border as Preview
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
