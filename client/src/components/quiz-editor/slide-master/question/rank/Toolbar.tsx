import { RankSlide } from "@/models/Quiz";
import { ToolbarProps } from "../../";
import { BaseQuestionToolbar } from "../base/QuestionToolbar";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type RankToolbarProps = ToolbarProps & {
    slide: RankSlide;
    onSlideUpdate: (slide: RankSlide) => void;
};

export function Toolbar({ slide, onSlideUpdate }: RankToolbarProps) {
    const [newRank, setNewRank] = useState<string>("");

    const updateSlide = (updatedRanking: string[]) => {
        onSlideUpdate({
            ...slide,
            ranking: updatedRanking,
        });
    };

    return (
        <BaseQuestionToolbar slide={slide} onSlideUpdate={onSlideUpdate}>
            <div className="space-y-4">
                <Label>Rank Answer</Label>
                {slide.ranking.map((rankItem, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <span className="p-2">{index + 1}</span>
                        <Input
                            type="text"
                            value={rankItem}
                            onChange={(e) => {
                                const updatedRanking = [...slide.ranking];
                                updatedRanking[index] = e.target.value;
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
                        value={newRank}
                        onChange={(e) => setNewRank(e.target.value)}
                        placeholder="Answer"
                        className="p-2 border border-gray-300 rounded"
                    />
                    <Button
                        onClick={() => {
                            if (newRank.trim() !== "") {
                                const updatedRanking = [...slide.ranking, newRank];
                                updateSlide(updatedRanking);
                                setNewRank("");
                            }
                        }}
                        className="p-1 bg-blue-500 text-white rounded"
                    >
                        Add
                    </Button>
                </div>
            </div>
        </BaseQuestionToolbar>
    );
}
