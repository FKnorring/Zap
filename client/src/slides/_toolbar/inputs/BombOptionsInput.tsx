import { BombSlide } from '@/models/Quiz';
import { ToolbarProps } from '@/slides/toolbar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { HeartIcon, Timer } from 'lucide-react';

export function BombOptionsInput({
  slide,
  onSlideUpdate,
}: ToolbarProps<BombSlide>) {
  const [newAnswer, setNewAnswer] = useState<string>('');

  const updateSlide = (updates: Partial<BombSlide>) => {
    onSlideUpdate({
      ...slide,
      ...updates,
    });
  };

  const { t } = useTranslation(['questions']);

  const addAnswers = (input: string) => {
    const newAnswers = input
      .split(',')
      .map((answer) => answer.trim())
      .filter((answer) => answer !== '');

    if (newAnswers.length === 0) return;

    // Ensure slide.answers is an array before adding new answers
    updateSlide({
      answers: Array.from(new Set([...(slide.answers || []), ...newAnswers])),
    });
  };

  const removeAnswer = (answerToRemove: string) => {
    updateSlide({
      answers: slide.answers.filter((answer) => answer !== answerToRemove),
    });
  };

  const maxHearts = 3; // Max number of hearts

  // Handle heart click (update the number of hearts)
  const handleHeartClick = (index: number) => {
    updateSlide({ hearts: index + 1 }); // Set hearts count based on the clicked index (0-based)
  };

  return (
    <div className="space-y-6">
      {/* Hearts and Initial Time */}
      <div className="space-y-2">
        <div className="flex items-center space-x-1">
          <Timer size={17} />
          <Label>{t('initialTime')}</Label>
        </div>

        <Input
          type="number"
          max={99}
          value={slide.initialTime}
          onChange={(e) => {
            const value = Math.min(Number(e.target.value), 99); // Clamp the value to 99
            updateSlide({ initialTime: value });
          }}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-1">
          {/* Heart Icon and Label */}

          <Label>{t('lives')}</Label>
        </div>

        <div className="flex space-x-2">
          {/* Render hearts */}
          {[...Array(maxHearts)].map((_, index) => (
            <div
              key={index}
              onClick={() => handleHeartClick(index)}
              className="cursor-pointer"
            >
              <HeartIcon
                fill={index < slide.hearts ? '#FF4545' : '#D1D1D1'} // Filled or unfilled color
                color={index < slide.hearts ? '#FF4545' : '#D1D1D1'} // Same color for both
              />
            </div>
          ))}
        </div>
      </div>

      {/* Answers Section */}
      <div className="space-y-2">
        <Label>{t('availableAnswers')}</Label>
        {/* Conditionally render the answers section if there are answers */}
        {slide.answers &&
        Array.isArray(slide.answers) &&
        slide.answers.length > 0 ? (
          slide.answers.map((answer, index) => (
            <div key={index} className="flex items-center space-x-2">
              <h2>{index + 1}</h2>
              <Input
                value={answer}
                onChange={(e) => {
                  const updatedAnswer = e.target.value.trim().toUpperCase();
                  if (!updatedAnswer) return;

                  updateSlide({
                    answers: slide.answers.map((a, i) =>
                      i === index ? updatedAnswer : a
                    ),
                  });
                }}
                placeholder="Answer"
              />
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeAnswer(answer)}
              >
                {t('del')}
              </Button>
            </div>
          ))
        ) : (
          <p>{t('noAnswer')}</p> // Optional message if there are no answers
        )}

        <div className="flex space-x-2 m-4">
          <Input
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder={t('ans1ans2')}
          />
        </div>
        <div className="justify-center flex">
          <Button
            onClick={() => {
              if (newAnswer.trim() !== '') {
                addAnswers(newAnswer.toUpperCase());
                setNewAnswer('');
              }
            }}
          >
            {t('addAnswer')}
          </Button>
        </div>
      </div>
    </div>
  );
}
