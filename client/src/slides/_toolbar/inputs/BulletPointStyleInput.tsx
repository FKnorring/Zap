import { BulletPointSlide } from "@/models/Quiz";
import { ToolbarProps } from "../../toolbar";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function BulletPointStyleInput({ slide, onSlideUpdate }: ToolbarProps<BulletPointSlide>) {
    const updateFontSize = (value: number) => {
        onSlideUpdate({
            ...slide,
            fontSize: Math.max(12, Math.min(72, value))
        });
    };

    const updateSpacing = (value: number) => {
        onSlideUpdate({
            ...slide,
            pointSpacing: Math.max(4, Math.min(24, value))
        });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Font Size ({slide.fontSize}px)</Label>
                <div className="flex gap-4">
                    <Slider
                        value={[slide.fontSize]}
                        onValueChange={([value]) => updateFontSize(value)}
                        min={12}
                        max={72}
                        step={1}
                        className="flex-1"
                    />
                    <Input
                        type="number"
                        value={slide.fontSize}
                        onChange={(e) => updateFontSize(Number(e.target.value))}
                        className="w-20"
                        min={12}
                        max={72}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Point Spacing ({slide.pointSpacing}px)</Label>
                <div className="flex gap-4">
                    <Slider
                        value={[slide.pointSpacing]}
                        onValueChange={([value]) => updateSpacing(value)}
                        min={4}
                        max={24}
                        step={1}
                        className="flex-1"
                    />
                    <Input
                        type="number"
                        value={slide.pointSpacing}
                        onChange={(e) => updateSpacing(Number(e.target.value))}
                        className="w-20"
                        min={4}
                        max={24}
                    />
                </div>
            </div>
        </div>
    );
} 