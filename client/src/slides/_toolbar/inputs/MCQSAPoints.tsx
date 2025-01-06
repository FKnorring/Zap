import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'; // Ensure you import SelectContent and SelectValue
import { MCQSASlide } from '@/models/Quiz';
import {
  MCQSAPointsAwarding,
  mcqsaPointsAwarding,
} from '@/models/types/questions';
import { Trophy, InfoIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function MCQSAPoints({
  slide,
  onSlideUpdate,
}: {
  slide: MCQSASlide;
  onSlideUpdate: (slide: MCQSASlide) => void;
}) {
  const handlePointsChange = (awardPoints: string) => {
    const updatedSlide = {
      ...slide,
      pointsAwarding: awardPoints as mcqsaPointsAwarding,
    };
    onSlideUpdate(updatedSlide); // Update slide with the new points value
  };
  const { t } = useTranslation(['quizEditor']);

  return (
    <div className="space-y-1">
      <div className="flex flex-row items-center space-x-1">
        <Trophy size={17} />
        <Label>{t('awardPoints')}</Label>
      </div>

      <Select
        value={slide.pointsAwarding}
        onValueChange={(value) => handlePointsChange(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue>
            {(() => {
              switch (slide.pointsAwarding) {
                case 'TIME':
                  return t('time');
                case 'CORRECT':
                  return t('correct');
                default:
                  return 'err';
              }
            })()}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TIME">
            <h1 className="font-bold">{t('time')}</h1>
            <h1>{t('timeDescription')}</h1>
          </SelectItem>
          <SelectItem value="CORRECT">
            <h1 className="font-bold">{t('correct')}</h1>
            <h1>{t('correctDescription')}</h1>
          </SelectItem>
        </SelectContent>
      </Select>
      {slide.pointsAwarding === MCQSAPointsAwarding.TIME &&
        slide.timeLimit === 0 && (
          <div className="flex flex-row items-center space-x-1 ">
            <InfoIcon size={16} className="text-red-400" />
            <p className="text-red-400 text-sm">{t('time.noLimit')}</p>
          </div>
        )}
    </div>
  );
}
