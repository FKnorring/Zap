import { QuestionSlide, ShowCorrectAnswerTypes } from '@/models/Quiz';
import { ToolbarProps } from '@/slides/toolbar';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Eye, Timer } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function QuestionSettingsInput({
  slide,
  onSlideUpdate,
}: ToolbarProps<QuestionSlide>) {
  const { t } = useTranslation(['quizEditor']);

  if (!('showCorrectAnswer' in slide)) return null;
  const questionSlide = slide as QuestionSlide;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex flex-row items-center space-x-1">
          <Eye size={17} />
          <Label>{t('showCorrect')}</Label>
        </div>
        <Select
          value={questionSlide.showCorrectAnswer || 'auto'}
          onValueChange={(value) =>
            onSlideUpdate({
              ...questionSlide,
              showCorrectAnswer: value as ShowCorrectAnswerTypes,
            })
          }
        >
          <SelectTrigger>
            <SelectValue>
              {(() => {
                switch (slide.showCorrectAnswer) {
                  case 'auto':
                    return 'Auto';
                  case 'manual':
                    return 'Manual';
                  case 'never':
                    return 'Never';
                  default:
                    return 'Select Award Points';
                }
              })()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">
              <h1 className="font-bold">{t('showCorrect.auto')}</h1>
              <h3>{t('showCorrectAuto')}</h3>
            </SelectItem>
            <SelectItem value="manual">
              <h1 className="font-bold">{t('showCorrect.manual')}</h1>
              <h3>{t('showCorrectManual')}</h3>
            </SelectItem>
            <SelectItem value="never">
              <h1 className="font-bold">{t('showCorrect.never')}</h1>
              <h3>{t('showCorrectNever')}</h3>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <div className="flex flex-row items-center">
          <Timer size={17} />
          <Label>{t('timeLimit')}</Label>
        </div>
        <Input
          type="number"
          value={questionSlide.timeLimit}
          onChange={(e) =>
            onSlideUpdate({
              ...questionSlide,
              timeLimit: parseInt(e.target.value),
            })
          }
        />
      </div>
    </div>
  );
}
