import { ToolbarProps } from '@/slides/toolbar';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'; // Ensure you import SelectContent and SelectValue
import { QuestionSlide } from '@/models/Quiz';
import { Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function SelectPoints({
  slide,
  onSlideUpdate,
}: ToolbarProps<QuestionSlide>) {
  const handlePointsChange = (newPoints: number) => {
    const updatedSlide = {
      ...slide,
      points: newPoints,
    };
    onSlideUpdate(updatedSlide); // Update slide with the new points value
  };
  const { t } = useTranslation(['quizEditor']);

  return (
    <div className="space-y-1">
      <div className="flex flex-row items-center">
        <Award size={17} />
        <Label>{t("points")}</Label>
      </div>

      <Select
        value={slide.points.toString()} // Current points value as string
        onValueChange={(value) => handlePointsChange(Number(value))} // Convert value to number before updating
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Points" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">No Points</SelectItem>
          <SelectItem value="1000">Default</SelectItem>
          <SelectItem value="2000">Double Points</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
