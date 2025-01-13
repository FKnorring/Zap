import { useState } from 'react';
import {
  useDraggable,
  useDroppable,
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensors,
  useSensor,
  DragEndEvent,
} from '@dnd-kit/core';
import { Button } from '@/components/ui/button';
import { RankSlide } from '@/models/Quiz';
import { cn } from '@/lib/utils';
import { SlideTitle } from '@/slides/_components/SlideTitle';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { max_options } from '@/config/max';
import { SlideContent } from '@/slides/_components/SlideContent';
import { TFunction } from 'i18next';

interface PreviewProps {
  slide: RankSlide;
  onSlideUpdate: (slide: RankSlide) => void;
}

function DraggableItem({
  text,
  index,
  onTextChange,
  t,
}: {
  text: string;
  index: number;
  onDelete: (index: number) => void;
  onTextChange: (newText: string) => void;
  t: TFunction;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${index}`,
  });

  const style = transform
    ? {
        transform: `translate3d(0, ${transform.y}px, 0)`,
        zIndex: 1000,
      }
    : {};

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="flex items-center w-full p-3 rounded-lg shadow-md bg-[#F4F3F2] text-4xl font-display cursor-grab"
      style={style}
    >
      <input
        type="text"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        placeholder={t('quizEditor:rankPlaceholder')}
        className="flex w-[80%] bg-transparent border-dashed text-black border-2 border-black p-2"
      />
    </div>
  );
}

function DroppableContainer({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${index}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'p-2 rounded-xl w-full border-primary/80 border-dashed border-2',
        isOver && 'bg-primary/50 border-primary'
      )}
    >
      {children}
    </div>
  );
}

export function Preview({ slide, onSlideUpdate }: PreviewProps) {
  const [currentRanking, setCurrentRanking] = useState<string[]>([
    ...slide.ranking,
  ]);
  const { t } = useTranslation();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeIndex = parseInt(String(active.id).split('-')[1], 10);
    const overIndex = parseInt(String(over.id).split('-')[1], 10);

    if (activeIndex !== overIndex) {
      const updatedRanking = [...currentRanking];
      const [movedItem] = updatedRanking.splice(activeIndex, 1);
      updatedRanking.splice(overIndex, 0, movedItem);
      setCurrentRanking(updatedRanking);
      onSlideUpdate({ ...slide, ranking: updatedRanking });
    }
  };

  const handleAddAlternative = () => {
    const updatedRanking = [...currentRanking, ''];
    setCurrentRanking(updatedRanking);
    onSlideUpdate({ ...slide, ranking: updatedRanking });
  };

  const handleTitleChange = (newTitle: string) => {
    onSlideUpdate({ ...slide, title: newTitle });
  };

  const handleContentChange = (newContent: string) => {
    onSlideUpdate({ ...slide, content: newContent });
  };

  const handleTextChange = (newText: string, index: number) => {
    const updatedRanking = [...currentRanking];
    updatedRanking[index] = newText;
    setCurrentRanking(updatedRanking);
    onSlideUpdate({ ...slide, ranking: updatedRanking });
  };

  const handleDelete = (index: number) => {
    const updatedRanking = currentRanking.filter((_, i) => i !== index);
    setCurrentRanking(updatedRanking);
    onSlideUpdate({ ...slide, ranking: updatedRanking });
  };

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const canAdd = currentRanking.length < max_options.rank;

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex flex-col items-center justify-center w-full p-4 space-y-4">
        <div className="flex items-center w-full space-x-2">
          <SlideTitle
            title={slide.title}
            onTitleChange={handleTitleChange}
            isEditable
          />
        </div>
        <div className="flex items-center w-full space-x-2">
          <SlideContent
            content={slide.content}
            onContentChange={handleContentChange}
            isEditable
          />
        </div>
        <div className="flex flex-col w-full max-w-6xl space-y-3">
          {currentRanking.map((text, index) => (
            <div key={index} className="flex items-center w-full space-x-4">
              <h2
                className="font-display text-5xl text-center text-[#F4F3F2] w-16"
                style={{ textAlign: 'center' }}
              >
                {index + 1}
              </h2>
              <DroppableContainer index={index}>
                <DraggableItem
                  text={text}
                  index={index}
                  onDelete={handleDelete}
                  t={t}
                  onTextChange={(newText) => handleTextChange(newText, index)}
                />
              </DroppableContainer>
              <Button
                className="text-red-500 [&_svg]:size-12"
                onClick={() => handleDelete(index)}
                variant="ghost"
              >
                <TrashIcon />
              </Button>
            </div>
          ))}
        </div>

        {canAdd && (
          <Button
            className="fixed bottom-10 items-center text-white text-4xl font-display p-8 [&_svg]:size-10 w-fit mx-auto"
            onClick={handleAddAlternative}
          >
            <PlusIcon className="h-10 w-10" />
            {t('quizEditor:addRanking')}
          </Button>
        )}
      </div>
    </DndContext>
  );
}
