import { BulletPointSlide } from "@/models/Quiz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { ToolbarProps } from "../../toolbar";
import { useState } from "react";

export function BulletPointsInput({ slide, onSlideUpdate }: ToolbarProps<BulletPointSlide>) {
    const [newPoint, setNewPoint] = useState("");
    const bulletPoints = slide.points || [];

    const addBulletPoint = () => {
        if (!newPoint.trim()) return;
        onSlideUpdate({
            ...slide,
            points: [...bulletPoints, newPoint.trim()]
        });
        setNewPoint("");
    };

    const removeBulletPoint = (index: number) => {
        const newBulletPoints = bulletPoints.filter((_, i) => i !== index);
        onSlideUpdate({
            ...slide,
            points: newBulletPoints
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    value={newPoint}
                    onChange={(e) => setNewPoint(e.target.value)}
                    placeholder="Add a bullet point"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            addBulletPoint();
                        }
                    }}
                />
                <Button
                    variant="outline"
                    size="icon"
                    onClick={addBulletPoint}
                    type="button"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <div className="space-y-2">
                {bulletPoints.map((point, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="flex-1 p-2 bg-muted rounded-md">
                            {point}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeBulletPoint(index)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
} 