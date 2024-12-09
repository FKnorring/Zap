import { ToolbarProps } from "@/slides/toolbar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FTASlide } from "@/models/Quiz";
import { SpellCheck } from "lucide-react";

export function AnswerText({ slide, onSlideUpdate }: ToolbarProps<FTASlide>) {
  // Ensure the slide is of type FTASlide

  return (
    <div className="space-y-1">
      <div className="flex flex-row items-center space-x-1">
        <SpellCheck size={16} />
        <Label>Correct Answer</Label>
      </div>

      <Input
        value={slide.correctAnswer}
        onChange={(e) => {
          const updatedSlide = {
            ...slide,
            correctAnswer: e.target.value, // Update the correctAnswer
          };
          onSlideUpdate(updatedSlide); // Trigger the slide update
        }}
        placeholder="Enter the correct answer..."
      />
    </div>
  );
}
