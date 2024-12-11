import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useMemo } from 'react';
import { ColorInput } from './ColorInput';
import { ShowCorrectAnswerTypes } from '@/models/Quiz';
import { SimpleSelect } from '../ui/SimpleSelect';
import { Quiz, QuizSettings } from '@/models/Quiz';
import { quizDefaults } from './utils/quiz-defaults';
import { BackgroundStyle } from './QuizBackground';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';

interface QuizSettingsToolbarProps {
  quiz: Quiz;
  onUpdate: (updates: { quizName?: string; settings?: QuizSettings }) => void;
}

export function QuizSettingsToolbar({
  quiz,
  onUpdate,
}: QuizSettingsToolbarProps) {
  const { quiz_name } = quiz;
  const originalSettings = useMemo(
    () => ({
      ...quizDefaults,
      ...quiz.settings,
    }),
    [quiz.settings]
  );

  const handleColorChange = (colorKey: string, value: string) => {
    const hexRegex = /^#[0-9A-F]{6}$/i;
    if (hexRegex.test(value)) {
      onUpdate({ settings: { ...originalSettings, [colorKey]: value } });
    }
  };

  const { t } = useTranslation();

  return (
    <div className="h-full bg-secondary/90 p-4 flex flex-col gap-4 overflow-y-auto text-black">
      <div className="space-y-2">
        <Label>{t('quizEditor:quizName')}</Label>
        <Input
          value={quiz_name}
          onChange={(e) => onUpdate({ quizName: e.target.value })}
          className="text-xl font-bold"
          placeholder="Quiz Name"
        />
      </div>

      <div className="space-y-4">
        <Label>{t('quizEditor:colorScheme')}</Label>

        <ColorInput
          label={t('quizEditor:backgroundColor')}
          value={originalSettings.backgroundColor}
          onChange={(value) => handleColorChange('backgroundColor', value)}
          placeholder="#000B58"
        />

        <ColorInput
          label={t('quizEditor:primary')}
          value={originalSettings.primaryColor}
          onChange={(value) => handleColorChange('primaryColor', value)}
          placeholder="#498e77"
        />

        <ColorInput
          label={t('quizEditor:secondary')}
          value={originalSettings.secondaryColor}
          onChange={(value) => handleColorChange('secondaryColor', value)}
          placeholder="#006a67"
        />
      </div>

      <SimpleSelect
        label={t('quizEditor:showCorrect')}
        value={originalSettings.showCorrectAnswerDefault || 'auto'}
        onValueChange={(value) =>
          onUpdate({
            settings: {
              ...originalSettings,
              showCorrectAnswerDefault: value as ShowCorrectAnswerTypes,
            },
          })
        }
        options={[
          { value: 'auto', label: t('quizEditor:showCorrect.auto') },
          { value: 'manual', label: t('quizEditor:showCorrect.manual') },
          { value: 'never', label: t('quizEditor:showCorrect.never') },
        ]}
      />

      <SimpleSelect
        label={t('quizEditor:backgroundStyle')}
        value={originalSettings.backgroundStyleDefault || 'blobInverted'}
        onValueChange={(value) =>
          onUpdate({
            settings: {
              ...originalSettings,
              backgroundStyleDefault: value as BackgroundStyle,
            },
          })
        }
        options={[
          { value: 'waves', label: 'Waves' },
          { value: 'blob', label: 'Blob' },
          { value: 'blobInverted', label: 'Blob Inverted' },
          { value: 'circle', label: 'Circle' },
          { value: 'solid', label: 'Solid' },
          { value: 'random', label: 'Random' },
        ]}
      />

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-4">
            {t('quizEditor:resetSettings')}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('quizEditor:resetSettings')}</DialogTitle>
            <DialogDescription>
              {t('quizEditor:resetSettings.description')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t('general:cancel')}</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant="destructive"
                onClick={() => onUpdate({ settings: quizDefaults })}
              >
                {t('quizEditor:resetSettings')}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
