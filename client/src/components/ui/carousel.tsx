import * as React from 'react';
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: 'horizontal' | 'vertical';
  setApi?: (api: CarouselApi) => void;
  rotateTime?: number; // time in seconds for automatic rotation
  children: React.ReactNode; // Make sure this is explicitly declared as required
  hideNavigation?: boolean; // Whether to hide navigation controls
  buttons: boolean;
  increment: number;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  increment: number;
  buttons: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }
  return context;
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      orientation = 'horizontal',
      opts,
      setApi,
      plugins,
      rotateTime = 10000,
      increment,
      buttons,
      children,
      hideNavigation = false,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === 'horizontal' ? 'x' : 'y',
        loop: true, // Enable looping behavior for continuous scrolling
      },
      plugins
    );

    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) return;
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      if (api) {
        // Scroll back by 'increment' steps
        const steps = increment || 1; // Default to 1 if increment is undefined
        for (let i = 0; i < steps; i++) {
          api.scrollPrev();
        }
      }
    }, [api, increment]);

    const scrollNext = React.useCallback(() => {
      if (api) {
        // Scroll forward by 'increment' steps
        const steps = increment || 1; // Default to 1 if increment is undefined
        for (let i = 0; i < steps; i++) {
          api.scrollNext();
        }
      }
    }, [api, increment]);

    // Auto-scroll functionality
    React.useEffect(() => {
      if (!api || !rotateTime) return;

      const interval = setInterval(() => {
        scrollNext(); // Automatically scroll to the next item
      }, rotateTime * 1000); // Convert to milliseconds

      return () => {
        clearInterval(interval); // Cleanup on unmount
      };
    }, [api, rotateTime, scrollNext]);

    // Sync API with external setApi function
    React.useEffect(() => {
      if (!api || !setApi) return;
      setApi(api);
    }, [api, setApi]);

    // Add event listeners for carousel selection changes
    React.useEffect(() => {
      if (!api) return;

      onSelect(api);
      api.on('reInit', onSelect);
      api.on('select', onSelect);

      return () => {
        api?.off('select', onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          opts,
          orientation,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          increment,
          buttons,
          children, // Ensure 'children' is provided in the context value
        }}
      >
        <div
          ref={ref}
          className={cn('relative')}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children} {/* Render children here */}
          {!hideNavigation && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </div>
      </CarouselContext.Provider>
    );
  }
);

Carousel.displayName = 'Carousel';

// Carousel Content Component
// Carousel Content Component
const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();
  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          'flex',
          orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
          className
        )}
        {...props}
        style={{
          transition: 'transform 0.25 ease-in-out', // Adjust the duration here (0.5s or more)
        }}
      />
    </div>
  );
});

CarouselContent.displayName = 'CarouselContent';

// Carousel Item Component
const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        orientation === 'horizontal' ? 'pl-4' : 'pt-4',
        className
      )}
      {...props}
    />
  );
});

CarouselItem.displayName = 'CarouselItem';

// Carousel Previous Button Component
const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev, buttons } = useCarousel();
  if (buttons)
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          'absolute h-16 w-16 rounded-full bg-gray-900',
          orientation === 'horizontal'
            ? '-left-14 top-1/2 -translate-y-1/2'
            : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
          className
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <ArrowLeft className="h-16 w-16" />
        <span className="sr-only">Previous slide</span>
      </Button>
    );
});

CarouselPrevious.displayName = 'CarouselPrevious';

// Carousel Next Button Component
const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext, buttons } = useCarousel();
  if (buttons)
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          'absolute h-16 w-16 rounded-full bg-gray-900',
          orientation === 'horizontal'
            ? '-right-12 top-1/2 -translate-y-1/2'
            : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90 ',
          className
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <ArrowRight className="h-16 w-16" />
        <span className="sr-only">Next slide</span>
      </Button>
    );
});

CarouselNext.displayName = 'CarouselNext';

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
