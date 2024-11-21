import { useState, useEffect } from "react";
import {
  useDraggable,
  useDroppable,
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensors,
  useSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { RankSlide } from "@/models/Quiz";

// Shuffle function to randomize the order
const shuffleArray = (array: string[]): string[] => {
  return array
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
};

// Draggable-Droppable item component
function DraggableDroppableItem({
  name,
  index,
  originalIndex,
}: {
  name: string;
  index: number;
  originalIndex: number;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${index}`, // Unique ID for each item
  });

  const { setNodeRef: droppableRef, isOver } = useDroppable({
    id: `droppable-${index}`, // Unique ID for each droppable area
  });

  // Combine the draggable and droppable refs
  const combinedRef = (node: HTMLElement | null) => {
    setNodeRef(node);
    droppableRef(node);
  };

  // Restrict to vertical movement by setting x to 0 and allowing y to change
  const style = transform
    ? {
        transform: `translate3d(0px, ${transform.y}px, 0)`, // Only change vertical position
        zIndex: isOver ? 1000 : undefined, // Bring item to top when it's over a droppable area
      }
    : {};

  return (
    <div className="flex items-center w-full">
      {/* Rank number column (fixed outside of the draggable component) */}
      <div className="m-4 rounded-full text-4xl font-bold">{`${
        originalIndex + 1
      }`}</div>

      {/* Draggable item column (rank name moves) */}
      <div
        ref={combinedRef}
        style={{ ...style, minHeight: "64px" }}
        {...listeners}
        {...attributes}
        className={`font-display flex items-center justify-start p-4 rounded-xl backdrop-blur-md flex-grow shadow-lg ${
          isOver
            ? "bg-green-500"
            : index % 2 === 0
            ? "bg-component-background"
            : "bg-gray-300"
        }`}
      >
        <span className="text-3xl font-bold text-textonwbg-grayonw">
          {name}
        </span>
      </div>
    </div>
  );
}

interface RankViewProps {
  question: RankSlide;
  answerQuestion: (answer: string) => void;
}

// Main SlideRank component
export default function RankView({ question, answerQuestion }: RankViewProps) {
  const ranking = question.ranking; // Assume ranking is now a list of strings
  const [currentRanking, setCurrentRanking] = useState<string[]>(ranking);

  function handleAnswerQuestion() {
    const answer = currentRanking.join(","); // Combine the strings into a single answer
    answerQuestion(answer);
  }

  // Randomize the ranking on the first render
  useEffect(() => {
    const randomizedRanking = shuffleArray([...ranking]);
    setCurrentRanking(randomizedRanking); // Update state with randomized ranking
  }, [ranking]);

  const topRanking = [...currentRanking];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Check if the item is dropped over a valid droppable area
    if (over) {
      const activeIndex = Number(String(active.id).replace("draggable-", ""));
      const overIndex = Number(String(over.id).replace("droppable-", ""));

      // Swap the items only if they are dropped in a different index
      if (activeIndex !== overIndex) {
        const updatedRanking = [...currentRanking];
        const [movedItem] = updatedRanking.splice(activeIndex, 1); // Remove the dragged item
        updatedRanking.splice(overIndex, 0, movedItem); // Insert it at the new position

        setCurrentRanking(updatedRanking); // Update the state to reflect the new order
      }
    } else {
      // If the item is dropped outside a droppable area, log that event
      console.log("Item dropped outside any droppable area");
    }
  };

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <div className="flex items-center justify-center h-screen w-full p-4">
        <div className="flex flex-col items-center space-y-4 w-full max-w-md max-h-[80vh] overflow-y-auto">
          <h3 className="text-3xl font-display text-center">
            {question.title}
          </h3>
          {topRanking.map((name, index) => (
            <DraggableDroppableItem
              key={index}
              name={name}
              index={index}
              originalIndex={currentRanking.indexOf(name)} // Keep original index for rank number
            />
          ))}
          <Button
            onClick={handleAnswerQuestion}
            className="py-8 px-12 font-display text-3xl"
          >
            Submit Answers
          </Button>
        </div>
      </div>
    </DndContext>
  );
}
