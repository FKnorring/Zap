import React from 'react';
import { JeopardySlide } from '@/models/Quiz';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { ArrowDownToLine, ArrowUpToLine } from 'lucide-react';

interface Props {
  slide: JeopardySlide;
  onSlideUpdate: (slide: JeopardySlide) => void;
}

export const JeopardyScoreInput: React.FC<Props> = ({ slide, onSlideUpdate }) => {
  const { t } = useTranslation('jeopardy');

  const updateScore = (field: 'minScore' | 'maxScore', value: string) => {
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
            <ArrowDownToLine className="w-4 h-4" />
            {t('minScore')}
          </Label>
          <Input
            type="number"
            value={slide.minScore}
            onChange={(e) => updateScore('minScore', e.target.value)}
            min={100}
            max={2000}
            step={100}
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <ArrowUpToLine className="w-4 h-4" />
            {t('maxScore')}
          </Label>
          <Input
            type="number"
            value={slide.maxScore}
            onChange={(e) => updateScore('maxScore', e.target.value)}
            min={slide.minScore}
            max={2000}
            step={100}
          />
        </div>
      </div>
    </div>
  );
};

export default JeopardyScoreInput; 