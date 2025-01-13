import { CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { max_options } from '@/config/max';
import { MCQMASlide } from '@/models/Quiz';
import { MCQSASlide } from '@/models/Quiz';
import { getColor } from '../base/QuizColors';
import { useTranslation } from 'react-i18next';

const MAX_MCQ_TEXT_LENGTH = max_options.mqsa.option_text_length;
const MAX_OPTIONS = max_options.mqsa.options;

interface RenderOptionsProps {
  slide: MCQMASlide | MCQSASlide;
  isEditable?: boolean;
  handleOptionChange?: (id: string, newText: string) => void;
  handleAddOption?: () => void;
  handleDeleteOption?: (id: string) => void;
  handleToggleCorrect?: (id: string) => void;
}

export default function RenderOptions({
  isEditable = false,
  handleOptionChange,
  handleAddOption,
  handleDeleteOption,
  handleToggleCorrect,
  slide,
}: RenderOptionsProps) {
  const canAdd = slide.options.length < MAX_OPTIONS;
  const { t } = useTranslation(['quizEditor']);

  // UI for displaying options
  if (
    !isEditable ||
    !handleOptionChange ||
    !handleAddOption ||
    !handleDeleteOption ||
    !handleToggleCorrect
  ) {
    return (
      <div
        className={cn(
          'grid grid-cols-2 gap-14',
          slide.options.length > 4 && 'grid grid-cols-3 gap-14'
        )}
      >
        {slide.options.map((option, index) => (
          <div
            key={option.id}
            style={{
              backgroundColor: getColor(index),
            }}
            className="flex items-center justify-center text-5xl text-white font-display h-56 w-[500px] rounded-lg box-border p-8"
          >
            <span>{option.text}</span>
          </div>
        ))}
      </div>
    );
  }

  // UI for editing options
  return (
    <>
      <div
        className={cn(
          'grid grid-cols-2 gap-10',
          slide.options.length > 4 && 'grid grid-cols-3 gap-10'
        )}
      >
        {slide.options.map((option) => {
          return (
            <div
              key={option.id}
              className={cn(
                'relative flex items-center justify-between text-5xl text-white font-display h-56 w-[500px] rounded-lg box-border p-6 gap-6',
                {
                  'bg-white/10 backdrop-blur outline outline-white/50':
                    !option.isCorrect,
                  'ring-4 ring-white': option.isCorrect,
                  'bg-green-600': option.isCorrect,
                }
              )}
            >
              <Textarea
                className="bg-transparent text-white flex-grow outline-none text-4xl px-1 h-full overflow-hidden border-dashed border-2"
                value={option.text}
                maxLength={MAX_MCQ_TEXT_LENGTH}
                onChange={(e) => handleOptionChange(option.id, e.target.value)}
              />
              <div className="flex items-center">
                <Button
                  onClick={() => handleToggleCorrect(option.id)}
                  variant="ghost"
                  className="[&_svg]:size-12 hover:bg-transparent"
                >
                  <CheckCircle2
                    className={cn('w-12 h-12', {
                      'text-white': option.isCorrect,
                      'text-gray-400': !option.isCorrect,
                    })}
                  />
                </Button>
              </div>

              <div className="absolute top-2 right-0">
                <Button
                  onClick={() => handleDeleteOption(option.id)}
                  variant="ghost"
                  className="[&_svg]:size-8 hover:bg-transparent"
                >
                  <Trash2 className="w-8 h-8 text-red-500" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {canAdd && (
        <Button
          onClick={handleAddOption}
          className="fixed bottom-10 items-center justify-center text-white rounded-lg p-10 [&_svg]:size-10 font-display"
        >
          <Plus size={16} strokeWidth={3} />
          <h1 className="text-3xl">{t('addOption')}</h1>
        </Button>
      )}
    </>
  );
}
