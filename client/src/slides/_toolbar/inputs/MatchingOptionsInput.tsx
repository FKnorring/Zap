import { MatchingSlide } from '@/models/Quiz';
import { ToolbarProps } from '@/slides/toolbar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { max_options } from '@/config/max';
import { Check, ChevronDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';

export function MatchingOptionsInput({
  slide,
  onSlideUpdate,
}: ToolbarProps<MatchingSlide>) {
  const [newLabel, setNewLabel] = useState<string>('');
  const [newOption, setNewOption] = useState<string>('');
  const { t } = useTranslation(['quizEditor']);

  const canAddLabel = slide.labels.length < max_options.match.labels;

  const updateSlide = (updates: Partial<MatchingSlide>) => {
    onSlideUpdate({
      ...slide,
      ...updates,
    });
  };

  const addOption = (option: string) => {
    if (option.trim() === '') return;
    updateSlide({
      options: [...slide.options, option],
    });
  };

  const removeOption = (optionToRemove: string) => {
    updateSlide({
      options: slide.options.filter((opt) => opt !== optionToRemove),
      labels: slide.labels.map((label) => ({
        ...label,
        correctOptions: label.correctOptions.filter(
          (opt) => opt !== optionToRemove
        ),
      })),
    });
  };

  const toggleOptionForLabel = (labelId: string, option: string) => {
    updateSlide({
      labels: slide.labels.map((label) => {
        // Remove the option from other labels first
        if (label.id !== labelId && label.correctOptions?.includes(option)) {
          return {
            ...label,
            correctOptions: label.correctOptions?.filter(
              (opt) => opt !== option
            ),
          };
        }
        // Then toggle it for the current label
        if (label.id === labelId) {
          const correctOptions = label.correctOptions?.includes(option)
            ? label.correctOptions?.filter((opt) => opt !== option)
            : [...(label.correctOptions || []), option];
          return { ...label, correctOptions };
        }
        return label;
      }),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Labels</Label>
        {slide.labels.map((label) => (
          <div key={label.id} className="mt-2 space-y-2">
            <div className="flex items-center space-x-2">
              <Input
                value={label.text}
                onChange={(e) => {
                  updateSlide({
                    labels: slide.labels.map((l) =>
                      l.id === label.id ? { ...l, text: e.target.value } : l
                    ),
                  });
                }}
                placeholder="Label"
              />
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  updateSlide({
                    labels: slide.labels.filter((l) => l.id !== label.id),
                  });
                }}
              >
                Del
              </Button>
            </div>
            <div className="space-y-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="truncate">
                      {label.correctOptions?.length > 0
                        ? label.correctOptions.join(', ')
                        : 'Select options...'}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <div className="max-h-[200px] overflow-auto">
                    {slide.options.map((option) => (
                      <div
                        key={option}
                        className={cn(
                          'flex items-center space-x-2 p-2 cursor-pointer hover:bg-accent',
                          label.correctOptions?.includes(option) &&
                            'bg-green-100'
                        )}
                        onClick={() => toggleOptionForLabel(label.id, option)}
                      >
                        <div className="w-4 h-4">
                          {label.correctOptions?.includes(option) && (
                            <Check className="h-4 w-4" />
                          )}
                        </div>
                        <span className="text-sm">{option}</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <Separator className="bg-black/10" />
          </div>
        ))}
        <div className="flex space-x-2 mt-4">
          <Input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="New Label"
          />
          <Button
            disabled={!canAddLabel}
            onClick={() => {
              if (newLabel.trim() !== '') {
                updateSlide({
                  labels: [
                    ...slide.labels,
                    {
                      id: Date.now().toString(),
                      text: newLabel,
                      correctOptions: [],
                    },
                  ],
                });
                setNewLabel('');
              }
            }}
          >
            {t('addCategory')}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("availableOptions")}</Label>
        {slide.options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              value={option}
              onChange={(e) => {
                const newOption = e.target.value;
                updateSlide({
                  options: slide.options.map((opt) =>
                    opt === option ? newOption : opt
                  ),
                  labels: slide.labels.map((label) => ({
                    ...label,
                    correctOptions: label.correctOptions.map((opt) =>
                      opt === option ? newOption : opt
                    ),
                  })),
                });
              }}
              placeholder="Option"
            />
            <Button
              variant="destructive"
              size="icon"
              onClick={() => removeOption(option)}
            >
              {t('del')}
            </Button>
          </div>
        ))}
        <div className="flex space-x-2">
          <Input
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder={t('newOption')}
          />
          <Button
            onClick={() => {
              addOption(newOption);
              setNewOption('');
            }}
          >
            {t('addOption')}
          </Button>
        </div>
      </div>
    </div>
  );
}
