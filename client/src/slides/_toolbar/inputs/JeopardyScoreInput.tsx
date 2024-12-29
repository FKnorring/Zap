import React from 'react';
import { JeopardySlide } from '@/models/Quiz';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  slide: JeopardySlide;
  onSlideUpdate: (slide: JeopardySlide) => void;
}

export const JeopardyScoreInput: React.FC<Props> = ({ slide, onSlideUpdate }) => {
  const updateScore = (field: 'minScore' | 'maxScore', value: string) => {
    const numValue = parseInt(value) || 0;
    onSlideUpdate({
      ...slide,
      [field]: numValue,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Minimum Score</Label>
        <Input
          type="number"
          value={slide.minScore}
          onChange={(e) => updateScore('minScore', e.target.value)}
          min={0}
          step={100}
        />
      </div>
      <div className="space-y-2">
        <Label>Maximum Score</Label>
        <Input
          type="number"
          value={slide.maxScore}
          onChange={(e) => updateScore('maxScore', e.target.value)}
          min={slide.minScore}
          step={100}
        />
      </div>
    </div>
  );
};

export default JeopardyScoreInput; 