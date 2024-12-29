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
        <Select
          value={questionSlide.timeLimit.toString()}
          onValueChange={(e) =>
            onSlideUpdate({
              ...questionSlide,
              timeLimit: parseInt(e),
            })
          }
        >
          <SelectTrigger>
            <SelectValue>{t(`timelimit.${slide.timeLimit}`)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">
              <h3>{t(`timelimit.0`)}</h3>
            </SelectItem>
            <SelectItem value="10">
              <h3>{t(`timelimit.10`)}</h3>
            </SelectItem>
            <SelectItem value="20">
              <h3>{t(`timelimit.20`)}</h3>
            </SelectItem>
            <SelectItem value="30">
              <h3>{t(`timelimit.30`)}</h3>
            </SelectItem>
            <SelectItem value="45">
              <h3>{t(`timelimit.45`)}</h3>
            </SelectItem>
            <SelectItem value="60">
              <h3>{t(`timelimit.60`)}</h3>
            </SelectItem>
            <SelectItem value="90">
              <h3>{t(`timelimit.90`)}</h3>
            </SelectItem>
            <SelectItem value="120">
              <h3>{t(`timelimit.120`)}</h3>
            </SelectItem>
            <SelectItem value="180">
              <h3>{t(`timelimit.180`)}</h3>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
