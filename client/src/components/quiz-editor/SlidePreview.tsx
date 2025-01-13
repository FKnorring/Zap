import type { Slide } from '@/models/Quiz';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { QuizBackground } from './QuizBackground';
import { getSlideComponents } from '@/slides/utils';

interface SlidePreviewProps {
  slide: Slide;
  className?: string;
  thumbnail?: boolean;
  backgroundColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  whichPreview?: string;
  onSlideUpdate?: (slide: Slide) => void;
}

const DESKTOP_WIDTH = 1920;
const DESKTOP_HEIGHT = 1080;

const PHONE_WIDTH = 414;
const PHONE_HEIGHT = 914;

export function SlidePreview({
  slide,
  className,
  backgroundColor = '#001220',
  primaryColor = '#FBAE3C',
  secondaryColor = '#498e77',
  whichPreview = 'Host',
  onSlideUpdate,
}: SlidePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const isPhoneView = whichPreview === 'Participant';

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const newScale =
        containerWidth / (isPhoneView ? PHONE_WIDTH : DESKTOP_WIDTH);
      setScale(newScale);
    };

    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [isPhoneView]);

  const SlideComponent = getSlideComponents(slide);

  const Slide =
    whichPreview in SlideComponent
      ? (SlideComponent[
          whichPreview as keyof typeof SlideComponent
        ] as React.ElementType<{
          slide: Slide;
          onSlideUpdate?: (slide: Slide) => void;
          inPreview?: boolean;
        }>)
      : null;

  const interactivePreview = SlideComponent.Info.interactivePreview || false;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full overflow-hidden',
        isPhoneView ? 'aspect-[9/16]' : 'aspect-video',
        !interactivePreview && 'pointer-events-none',
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
          width: isPhoneView ? PHONE_WIDTH : DESKTOP_WIDTH,
          height: isPhoneView ? PHONE_HEIGHT : DESKTOP_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        <div className="w-full h-full flex items-center justify-center boarder-2 rounded-lg">
          {Slide && (
            <Slide
              slide={slide}
              onSlideUpdate={onSlideUpdate}
              inPreview={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
