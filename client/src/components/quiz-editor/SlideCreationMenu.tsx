import { Separator } from "@/components/ui/separator";
import { PopoverContent } from "@/components/ui/popover";
import {
  InfoIcon,
  CircleDotIcon,
  CheckSquareIcon,
  TypeIcon,
} from "lucide-react";
import type { SlideType, QuestionType } from "@/models/Quiz";
import { SlideOption } from "./SlideOption";
import { MasterScoreOption } from "./slide-master/master-score";
import { MasterRankOption } from "./slide-master/master-rank";

const slides = [MasterScoreOption];

const questions = [MasterRankOption];

interface SlideCreationMenuProps {
  onAddSlide: (type: SlideType, questionType?: QuestionType) => void;
}

export function SlideCreationMenu({ onAddSlide }: SlideCreationMenuProps) {
  const handleAddSlide = (type: SlideType, questionType?: QuestionType) => {
    onAddSlide(type, questionType);
  };

  return (
    <PopoverContent className="w-56">
      <div className="space-y-2">
        <h4 className="font-medium leading-none mb-3">Add Slide</h4>
        <SlideOption
          label="Information Slide"
          icon={InfoIcon}
          onClick={() => handleAddSlide("info")}
        />

        {slides.map((slides) => {
          const renderedOption = slides({ handleAddSlide });
          return renderedOption;
        })}

        <Separator className="my-2" />

        <h4 className="font-medium leading-none mb-2">Question Types</h4>

        <SlideOption
          label="Single Answer MCQ"
          icon={CircleDotIcon}
          onClick={() => handleAddSlide("question", "MCQSA")}
        />

        <SlideOption
          label="Multiple Answer MCQ"
          icon={CheckSquareIcon}
          onClick={() => handleAddSlide("question", "MCQMA")}
        />

        <SlideOption
          label="Free Answer"
          icon={TypeIcon}
          onClick={() => handleAddSlide("question", "FA")}
        />

        {questions.map((question) => {
          const renderedOption = question({ handleAddSlide });
          return renderedOption;
        })}
      </div>
    </PopoverContent>
  );
}
