import { BulletPointSlide } from "@/models/Quiz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { ToolbarProps } from "../../toolbar";
import { useState } from "react";

export function BulletPointSlideInput({ slide, onSlideUpdate }: ToolbarProps<BulletPointSlide>) {
    const [newPoint, setNewPoint] = useState("");

    const addPoint = () => {
        if (!newPoint.trim()) return;
        onSlideUpdate({
            ...slide,
            points: [...slide.points, newPoint.trim()]
        });
        setNewPoint("");
    };

    const removePoint = (index: number) => {
        onSlideUpdate({
            ...slide,
            points: slide.points.filter((_, i) => i !== index)
        });
    };

    const movePoint = (index: number, direction: 'up' | 'down') => {
        const newPoints = [...slide.points];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        
        if (newIndex < 0 || newIndex >= newPoints.length) return;
        
        [newPoints[index], newPoints[newIndex]] = [newPoints[newIndex], newPoints[index]];
        
        onSlideUpdate({
            ...slide,
            points: newPoints
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    value={newPoint}
                    onChange={(e) => setNewPoint(e.target.value)}
                    placeholder="Add a new point"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            addPoint();
                        }
                    }}
                />
                <Button
                    variant="outline"
                    size="icon"
                    onClick={addPoint}
                    type="button"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <div className="space-y-2">
                {slide.points.map((point, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center bg-muted rounded-full font-medium">
                            {index + 1}
                        </div>
                        <div className="flex-1 p-2 bg-muted rounded-md">
                            {point}
                        </div>
                        <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => movePoint(index, 'up')}
                                disabled={index === 0}
                            >
                                <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => movePoint(index, 'down')}
                                disabled={index === slide.points.length - 1}
                            >
                                <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removePoint(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 