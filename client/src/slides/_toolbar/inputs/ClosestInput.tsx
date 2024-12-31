import { useTranslation } from "react-i18next";
import { ClosestSlide } from "@/models/Quiz";
import { Target } from "lucide-react";
import { ToolbarNumberInput } from "./ToolbarNumberInput";

interface ClosestInputProps {
  slide: ClosestSlide;
  onSlideUpdate: (slide: ClosestSlide) => void;
}

export function ClosestInput({ slide, onSlideUpdate }: ClosestInputProps) {
  const { t } = useTranslation(["toolbar"]);

  const handleNumberChange = (value: number) => {
    onSlideUpdate({
      ...slide,
      correctAnswer: value,
    });
  };

  return (
    <div className="space-y-4">
      <ToolbarNumberInput
        value={slide.correctAnswer}
        onChange={handleNumberChange}
        label={t("correctAnswer")}
        icon={Target}
      />
    </div>
  );
} 