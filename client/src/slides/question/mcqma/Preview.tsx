import { MCQMASlide } from '@/models/Quiz';
import { BaseQuestionRender } from '@/slides/question/base/QuestionRender';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Preview({ slide }: { slide: MCQMASlide }) {
  return (
    <BaseQuestionRender slide={slide}>
      <div className="flex flex-col items-center justify-center h-full p-10">
        <div className="grid grid-cols-2 gap-6 w-full max-w-3xl">
          {slide.options.map((option) => (
            <div
              key={option.id}
              className={cn(
                'flex items-center justify-between text-2xl text-white font-display h-24 p-6 gap-4 rounded-lg box-border', // Added box-border for consistency
                {
                  'bg-white/10 backdrop-blur outline outline-white/50':
                    !option.isCorrect, // Blur effect for wrong options
                  'ring-4 ring-white': option.isCorrect, // Green border for correct options
                  'bg-white/10': !option.isCorrect,
                  'bg-green-600': option.isCorrect,
                }
              )}
            >
              <span className="text-center">{option.text}</span>
              {option.isCorrect && (
                <CheckCircle2 className="w-8 h-8 text-white ml-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </BaseQuestionRender>
  );
}
