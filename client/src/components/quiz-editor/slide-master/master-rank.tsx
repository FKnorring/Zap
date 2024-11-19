import { RankSlide } from "@/models/Quiz";
import { SlideOption } from "../SlideOption";
import { ListOrdered } from "lucide-react";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SlideType, QuestionType } from "@/models/Quiz";

// Interface for the ranking slide


// Props for adding rank slide
interface MasterRankOptionProps {
  handleAddSlide: (type: SlideType, questionType?: QuestionType) => void; // Handles adding the slide with optional question type
}


// MasterRankOption: Renders the button to add a rank slide
export function MasterRankOption({ handleAddSlide }: MasterRankOptionProps) {
  return (
    <SlideOption
      label="Rank answers"
      icon={ListOrdered}
      onClick={() => {
        console.log("Rank Slide clicked!"); // Log when the button is clicked
        handleAddSlide("question", "rank"); // Call the passed function to add the "rank" slide
      }}
    />
  );
}

interface MasterToolbarRankProps {
  initialSlide: RankSlide; // The initial ranking slide data
  onSlideUpdate: (updatedSlide: RankSlide) => void; // Function to propagate changes
}

export const MasterToolbarRank: React.FC<MasterToolbarRankProps> = ({
  initialSlide,
  onSlideUpdate,
}) => {
  const [slide, setSlide] = useState<RankSlide>(initialSlide); // Local state for ranking slide
  const [newRank, setNewRank] = useState<{ name: string; score: number }>({
    name: "",
    score: 0,
  });

  const updateSlide = (updatedRanking: { name: string; score: number }[]) => {
    const updatedSlide = {
      ...slide,
      ranking: updatedRanking,
    };
    setSlide(updatedSlide); // Update local state
    onSlideUpdate(updatedSlide); // Notify parent
  };

  return (
    <div className="space-y-4">
      <Label>Rank Answer</Label>
      {slide.ranking.map((rankItem, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span className="p-2">{index + 1}</span>
          <Input
            type="text"
            value={rankItem.name}
            onChange={(e) => {
              const updatedRanking = [...slide.ranking];
              updatedRanking[index] = {
                ...updatedRanking[index],
                name: e.target.value,
              };
              updateSlide(updatedRanking);
            }}
            placeholder="New answer"
            className="p-2 border border-gray-300 rounded"
          />
        </div>
      ))}
      <div className="flex space-x-2">
        <Input
          type="text"
          value={newRank.name}
          onChange={(e) =>
            setNewRank({
              ...newRank,
              name: e.target.value,
            })
          }
          placeholder="Answer"
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={() => {
            const updatedRanking = [...slide.ranking, newRank];
            updateSlide(updatedRanking);
            setNewRank({ name: "", score: 0 }); // Reset newRank
          }}
          className="p-1 bg-blue-500 text-white rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
};
