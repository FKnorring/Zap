import { BulletPointSlide } from "@/models/Quiz";
import { ToolbarProps } from "../../toolbar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function ImagePositionInput({ slide, onSlideUpdate }: ToolbarProps<BulletPointSlide>) {
    if (!slide.imageUrl) return null;

    return (
        <RadioGroup
            value={slide.imagePosition || 'right'}
            onValueChange={(value: 'left' | 'right') =>
                onSlideUpdate({
                    ...slide,
                    imagePosition: value
                })
            }
            className="flex gap-4"
        >
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="left" id="left" />
                <Label htmlFor="left">Left</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="right" id="right" />
                <Label htmlFor="right">Right</Label>
            </div>
        </RadioGroup>
    );
} 