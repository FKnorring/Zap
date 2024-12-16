import { useDroppable } from "@dnd-kit/core";
import { DraggableItem } from "./DraggableItem";

interface DroppableContainerProps {
  id: string;
  label: string;
  matchedOptions?: string[];
}

export function DroppableContainer({
  id,
  label,
  matchedOptions = [],
}: DroppableContainerProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <>
      <h3 className="textlgl font-semibold ml-2 mb-2">{label}</h3>
      <div
        ref={setNodeRef}
        className={`min-h-[4rem] rounded-lg border-2 border-dashed transition-colors p-2
          ${
            isOver
              ? "border-primary bg-primary/20"
              : "border-muted-foreground/50 bg-background/50"
          }
          ${matchedOptions.length > 0 ? "border-solid border-primary" : ""}`}
      >
        <div className="flex flex-wrap gap-2">
          {matchedOptions.map((option) => (
            <DraggableItem
              key={option}
              id={option}
              text={option}
              inDroppable={true}
            />
          ))}
        </div>
      </div>
    </>
  );
}
