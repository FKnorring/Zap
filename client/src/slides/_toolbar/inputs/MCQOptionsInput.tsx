import { MCQMASlide } from '@/models/Quiz';
import { ToolbarProps } from '@/slides/toolbar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MinusIcon, PlusIcon } from 'lucide-react';
import {
  addOption,
  OptionSlide,
  removeOption,
  updateOption,
} from '../../question/helpers/options';
import { max_options } from '@/config/max';
import { CustomTooltip } from '@/components/ui/custom-tooltip';
import { useTranslation } from 'react-i18next';

const MAX_OPTIONS = max_options.mcqma;

export function MCQOptionsInput({
  slide,
  onSlideUpdate,
}: ToolbarProps<MCQMASlide>) {
  if (!('options' in slide)) return null;

  const { t } = useTranslation(['quizEditor']);
  const canAdd = slide.options.length < MAX_OPTIONS;

  const totalChecked = slide.options.filter((opt) => opt.isCorrect).length;

  return (
    <div className="space-y-2">
      <Label>{t('options')}</Label>
      <div className="space-y-2">
        {slide.options.map((option) => (
          <div key={option.id} className="flex items-center gap-2">
            <Switch
              checked={option.isCorrect}
              onCheckedChange={(checked: boolean) => {
                // If user tries to uncheck the only checked option, do nothing
                if (!checked && totalChecked === 1 && option.isCorrect) {
                  return;
                }

                updateOption(
                  slide,
                  option.id,
                  { isCorrect: checked },
                  onSlideUpdate as (slide: OptionSlide) => void
                );
              }}
            />
            <Input
              value={option.text}
              maxLength={30}
              onChange={(e) =>
                updateOption(
                  slide as MCQMASlide,
                  option.id,
                  { text: e.target.value },
                  onSlideUpdate as (slide: OptionSlide) => void
                )
              }
              placeholder={t('optionText') + '...'}
            />
            <Button
              variant="destructive"
              size="icon"
              onClick={() =>
                removeOption(
                  slide as MCQMASlide,
                  option.id,
                  onSlideUpdate as (slide: OptionSlide) => void
                )
              }
            >
              <MinusIcon className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {canAdd ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              addOption(
                slide as MCQMASlide,
                onSlideUpdate as (slide: OptionSlide) => void
              )
            }
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            {t('addOption')}
          </Button>
        ) : (
          <CustomTooltip content={t('maxOptionsReached')}>
            <Button variant="outline" className="w-full" disabled>
              <PlusIcon className="mr-2 h-4 w-4" />
              {t('addOption')}
            </Button>
          </CustomTooltip>
        )}
      </div>
    </div>
  );
}
