import { QuestionSlide, ShowCorrectAnswerTypes } from "@/models/Quiz";
import { ToolbarProps } from "@/slides/toolbar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Eye, Timer } from "lucide-react";

export function QuestionSettingsInput({
  slide,
  onSlideUpdate,
}: ToolbarProps<QuestionSlide>) {
  if (!("showCorrectAnswer" in slide)) return null;
  const questionSlide = slide as QuestionSlide;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex flex-row items-center space-x-1">
          <Eye size={17} />
          <Label>Show Correct Answer</Label>
        </div>
        <Select
          value={questionSlide.showCorrectAnswer || "auto"}
          onValueChange={(value) =>
            onSlideUpdate({
              ...questionSlide,
              showCorrectAnswer: value as ShowCorrectAnswerTypes,
            })
          }
        >
          <SelectTrigger>
            <SelectValue>
              {(() => {
                switch (slide.showCorrectAnswer) {
                  case "auto":
                    return "Auto";
                  case "manual":
                    return "Manual";
                  case "never":
                    return "Never";
                  default:
                    return "Select Award Points";
                }
              })()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">
              <h1 className="font-bold">Auto</h1>
              <h3>
                Shows the correct answers when everyone has answered or the time
                runs out.
              </h3>
            </SelectItem>
            <SelectItem value="manual">
              <h1 className="font-bold">Manual</h1>
              <h3>
                Renders a button that allows the presenter to show the correct
                answers.
              </h3>
            </SelectItem>
            <SelectItem value="never">
              <h1 className="font-bold">Never</h1>
              <h3>Never show the correct answers.</h3>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <div className="flex flex-row items-center">
          <Timer size={17} />
          <Label>Time Limit</Label>
        </div>
        <Input
          type="number"
          value={questionSlide.timeLimit}
          onChange={(e) =>
            onSlideUpdate({
              ...questionSlide,
              timeLimit: parseInt(e.target.value),
            })
          }
        />
      </div>
    </div>
  );
}
