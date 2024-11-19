import type { Slide } from "@/models/Quiz";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { QuizBackground } from "./QuizBackground";
import { SlideTitle } from "./slide-content/SlideTitle";
import { SlideContent } from "./slide-content/SlideContent";
import { QuestionOptions } from "./slide-content/QuestionOptions";

import ScoreBoard from "@/pages/host/Scoreboard";

interface SlideRenderProps {
  slide: Slide & { titleWiggle?: boolean; contentWiggle?: boolean };
  className?: string;
  thumbnail?: boolean;
  backgroundColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

const SLIDE_WIDTH = 1920;
const SLIDE_HEIGHT = 1080;

export function SlideRender({
  slide,
  className,
  thumbnail = false,
  backgroundColor = "#000B58",
  primaryColor = "#006a67",
  secondaryColor = "#fff4b7",
}: SlideRenderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const newScale = containerWidth / SLIDE_WIDTH;
      setScale(newScale);
    };

    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const renderContent = () => {
    if (thumbnail) {
      return <SlideTitle title={slide.title} size="small" />;
    }

    let questionContent = null;  // Declare questionContent outside the switch

    switch (slide.type) {
      case "info":
        return (
          <div className="space-y-8">
            <SlideTitle title={slide.title} wiggle={slide.titleWiggle} />
            {slide.imageUrl && (
              <div className="flex justify-center">
                <div className="relative flex items-center justify-center">
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-auto object-contain"
                    style={{
                      height: `${(slide.imageScale || 1) * 400}px`,
                      transition: "height 0.2s ease-out",
                    }}
                  />
                </div>
              </div>
            )}
            <SlideContent
              content={slide.content}
              wiggle={slide.contentWiggle}
            />
          </div>
        );

      case "score":
        return (
          <div className="space-y-12 w-full">
            <SlideTitle title={slide.title} wiggle={slide.titleWiggle} />
            <ScoreBoard scoreboard={slide.mockScores || []} />
          </div>
        );

      case "question":
        // Handle question type logic
        switch (slide.questionType) {
          case "MCQSA":
          case "MCQMA":
            questionContent = (
              <QuestionOptions
                options={slide.options}
                type={slide.questionType}
              />
            );
            break;

          case "rank":
            questionContent = (
              <div className="text-[40px] text-center italic text-muted-foreground">
                rank question
              </div>
            );
            break;

          default:
            questionContent = (
              <div className="text-[40px] text-center italic text-muted-foreground">
                Unknown question type
              </div>
            );
        }

        return (
          <div className="space-y-12 w-full">
            <div className="space-y-8">
              <SlideTitle title={slide.title} wiggle={slide.titleWiggle} />
              {slide.imageUrl && (
                <div className="flex justify-center">
                  <div className="relative flex items-center justify-center">
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      className="w-auto max-h-[400px] object-contain"
                      style={{
                        height: `${(slide.imageScale || 1) * 400}px`,
                        transition: "height 0.2s ease-out",
                      }}
                    />
                  </div>
                </div>
              )}
              <SlideContent
                content={slide.content}
                wiggle={slide.contentWiggle}
              />
            </div>

            {/* Render the question content */}
            {questionContent}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative",
        "aspect-video w-full",
        "overflow-hidden",
        className
      )}
    >
      <QuizBackground
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        backgroundColor={backgroundColor}
        className="absolute inset-0"
        style={slide.backgroundStyle}
      />
      <div
        className="origin-top-left relative"
        style={{
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        <div className="w-full h-full flex items-center justify-center p-16">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
