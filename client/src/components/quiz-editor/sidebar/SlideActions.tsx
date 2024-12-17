import { Button } from "@/components/ui/button";
import { CopyIcon, TrashIcon, MoveUpIcon, MoveDownIcon } from "lucide-react";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { useSlideSidebarContext } from './SlideSidebarContext';

interface SlideActionsProps {
    index: number;
    totalSlides: number;
    slideId: string;
}

export function SlideActions({
    index,
    totalSlides,
    slideId
}: SlideActionsProps) {
    const { onSlideMove, onSlideDuplicate, onSlideDelete } = useSlideSidebarContext();

    return (
        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {index > 0 && (
                <CustomTooltip content="Move Up">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSlideMove(slideId, 'up');
                        }}
                    >
                        <MoveUpIcon className="h-4 w-4" />
                    </Button>
                </CustomTooltip>
            )}
            
            {index < totalSlides - 1 && (
                <CustomTooltip content="Move Down">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSlideMove(slideId, 'down');
                        }}
                    >
                        <MoveDownIcon className="h-4 w-4" />
                    </Button>
                </CustomTooltip>
            )}
            
            <CustomTooltip content="Duplicate">
                <Button
                    variant="secondary"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                        e.stopPropagation();
                        onSlideDuplicate(slideId);
                    }}
                >
                    <CopyIcon className="h-4 w-4" />
                </Button>
            </CustomTooltip>
            
            <CustomTooltip content="Delete">
                <Button
                    variant="destructive"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                        e.stopPropagation();
                        onSlideDelete(slideId);
                    }}
                >
                    <TrashIcon className="h-4 w-4" />
                </Button>
            </CustomTooltip>
        </div>
    );
} 