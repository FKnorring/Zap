import React from 'react';
import { JeopardySlide } from '@/models/Quiz';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { Bell, Hourglass } from 'lucide-react';

interface Props {
  slide: JeopardySlide;
  onSlideUpdate: (slide: JeopardySlide) => void;
}

export const JeopardyTimeLimits: React.FC<Props> = ({ slide, onSlideUpdate }) => {
  const { t } = useTranslation('jeopardy');

  const updateTimeLimit = (field: 'mainTimeLimit' | 'answerTimeLimit', value: string) => {
    const numValue = parseInt(value) || 0;
    onSlideUpdate({
      ...slide,
      [field]: numValue,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            {t('mainTimeLimit')}
          </Label>
          <Input
            type="number"
            value={slide.mainTimeLimit}
            onChange={(e) => updateTimeLimit('mainTimeLimit', e.target.value)}
            min={1}
            max={60}
            step={1}
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Hourglass className="w-4 h-4" />
            {t('answerTimeLimit')}
          </Label>
          <Input
            type="number"
            value={slide.answerTimeLimit}
            onChange={(e) => updateTimeLimit('answerTimeLimit', e.target.value)}
            min={1}
            max={60}
            step={1}
          />
        </div>
      </div>
    </div>
  );
};

export default JeopardyTimeLimits; 