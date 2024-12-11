import { PlusCircle } from "lucide-react";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { SlideCreationMenu } from "./SlideCreationMenu";
import type { Slide } from "@/models/Quiz";
import { SlidePreview } from "./SlidePreview";
import { useEffect, useState } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { SlideActions } from "./SlideActions";
import { getSlideComponents } from "@/slides/utils";

interface SlideSidebarProps {
  quizName: string;
  slides: Slide[];
  onAddSlide: Parameters<typeof SlideCreationMenu>[0]["onAddSlide"];
  activeSlideId: string | null;
  onSlideSelect: (slideId: string) => void;
  onSlideDelete: (slideId: string) => void;
  onSlideDuplicate: (slideId: string) => void;
  onSlideMove: (slideId: string, direction: "up" | "down") => void;
  onSettingsClick: () => void;
  onSaveClick: () => void;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
}

export function SlideSidebar({
  quizName,
  slides,
  onAddSlide,
  activeSlideId,
  onSlideSelect,
  onSlideDelete,
  onSlideDuplicate,
  onSlideMove,
  onSettingsClick,
  backgroundColor,
  primaryColor,
  secondaryColor,
}: SlideSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        !activeSlideId ||
        !document.activeElement?.closest(".slides-container")
      )
        return;

      const currentIndex = slides.findIndex(
        (slide) => slide.id === activeSlideId,
      );
      if (currentIndex === -1) return;

      switch (e.key) {
        case "ArrowUp":
        case "ArrowLeft":
          if (currentIndex > 0) {
            e.preventDefault();
            onSlideSelect(slides[currentIndex - 1].id);
          }
          break;
        case "ArrowDown":
        case "ArrowRight":
          if (currentIndex < slides.length - 1) {
            e.preventDefault();
            onSlideSelect(slides[currentIndex + 1].id);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeSlideId, slides, onSlideSelect]);

  return (
    <aside className="min-w-[200px] bg-card/90 h-full border-r shadow-md flex flex-col overflow-hidden">
      <SidebarHeader quizName={quizName} onSettingsClick={onSettingsClick} />

      <div className="flex-1 overflow-y-auto px-3 pt-1 slides-container">
        <div className="flex flex-col gap-2 pb-3">
          {slides.map((slide, index) => {
            const slideComponent = getSlideComponents(slide);
            return (
              <div key={slide.id}>
                <h1 className="font-bold text-black text-sm">
                  {index + 1}. {slideComponent.Info.label}
                </h1>
                <h1></h1>
                <div
                  key={slide.id}
                  className={`group relative border rounded overflow-hidden transition-colors
                                ${
                                  activeSlideId === slide.id
                                    ? "border-primary ring-2 ring-primary"
                                    : "hover:border-primary/50"
                                }
                            `}
                  onClick={() => onSlideSelect(slide.id)}
                  tabIndex={0}
                  role="button"
                  aria-selected={activeSlideId === slide.id}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSlideSelect(slide.id);
                    }
                  }}
                >
                  <div className="cursor-pointer">
                    <SlidePreview
                      slide={slide}
                      backgroundColor={backgroundColor}
                      primaryColor={primaryColor}
                      secondaryColor={secondaryColor}
                    />
                  </div>

                  <SlideActions
                    index={index}
                    totalSlides={slides.length}
                    onSlideMove={onSlideMove}
                    onSlideDuplicate={onSlideDuplicate}
                    onSlideDelete={onSlideDelete}
                    slideId={slide.id}
                  />
                </div>
              </div>
            );
          })}

          {/* New Slide Button */}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <div
                className="bg-white border-grey-300 aspect-video border-2 border-dashed rounded flex items-center justify-center cursor-pointer
                                        hover:border-primary hover:bg-primary/5 transition-colors"
                onMouseEnter={() => setIsOpen(true)}
              >
                <PlusCircle className="w-4 h-4 text-muted-foreground " />
                <h1 className="text-muted-foreground pl-1">Add Slide</h1>
              </div>
            </PopoverTrigger>
            <SlideCreationMenu
              onCloseMenu={() => setIsOpen(false)}
              onAddSlide={onAddSlide}
            />
          </Popover>
        </div>
      </div>
    </aside>
  );
}
