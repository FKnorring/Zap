import { RankSlide } from '@/models/Quiz';
import { ToolbarProps } from '@/slides/toolbar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { ListOrdered } from 'lucide-react';
import { max_options } from '@/config/max';
import { useTranslation } from 'react-i18next';

export function RankOptionsInput({
  slide,
  onSlideUpdate,
}: ToolbarProps<RankSlide>) {
  const [newRank, setNewRank] = useState<string>('');
  const { t } = useTranslation(['questions']);

  if (!('ranking' in slide)) return null;

  const updateSlide = (updatedRanking: string[]) => {
    onSlideUpdate({
      ...slide,
      ranking: updatedRanking,
    } as RankSlide);
  };

  const canAdd = slide.ranking.length < max_options.rank;

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center space-x-1">
        <ListOrdered size={17} />
        <Label>{t('rankAnswer')}</Label>
      </div>
      {(slide as RankSlide).ranking.map((rankItem, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span className="p-0 font-bold">{index + 1}</span>
          <Input
            value={rankItem}
            onChange={(e) => {
              const updatedRanking = [...(slide as RankSlide).ranking];
              updatedRanking[index] = e.target.value;
              updateSlide(updatedRanking);
            }}
            placeholder="New answer"
          />
          <Button
            variant="destructive"
            size="icon"
            onClick={() => {
              const updatedRanking = (slide as RankSlide).ranking.filter(
                (_, i) => i !== index
              );
              updateSlide(updatedRanking);
            }}
          >
            <Trash2 />
          </Button>
        </div>
      ))}
      <div className="flex space-x-2">
        {canAdd && (
          <>
            <Input
              value={newRank}
              onChange={(e) => setNewRank(e.target.value)}
              placeholder="Answer"
            />
            <Button
              onClick={() => {
                if (newRank.trim() !== '') {
                  const updatedRanking = [
                    ...(slide as RankSlide).ranking,
                    newRank,
                  ];
                  updateSlide(updatedRanking);
                  setNewRank('');
                }
              }}
            >
              {t('add')}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
