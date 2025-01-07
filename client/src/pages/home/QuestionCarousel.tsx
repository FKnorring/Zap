import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import dallebomb from '@/assets/questionImagesAI/dallebomb.webp';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import jeopardy from '@/assets/questionImages/jeopardy.png';
import fa from '@/assets/questionImages/fa.png';
import locateit from '@/assets/questionImages/locateit.png';
import match from '@/assets/questionImages/match.png';
import rank from '@/assets/questionImages/rank.png';

export default function QuestionCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const { t } = useTranslation();

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const images = [
    {
      img: locateit,
      title: t('questions:LOCATEIT'),
      text: t('homepage:questionDescriptions.locateit'),
    },
    {
      img: fa,
      title: t('questions:FA'),
      text: t('homepage:questionDescriptions.fastest'),
    },
    {
      img: match,
      title: t('questions:MATCHING'),
      text: t('homepage:questionDescriptions.matching'),
    },
    {
      img: jeopardy,
      title: t('questions:JEOPARDY'),
      text: t('homepage:questionDescriptions.jeopardy'),
    },
    {
      img: rank,
      title: t('questions:RANK'),
      text: t('homepage:questionDescriptions.rank'),
    },
    {
      img: dallebomb,
      title: t('questions:BOMB'),
      text: t('homepage:questionDescriptions.bomb'),
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center w-full bg-[#F4F4F4]">
      <h1 className="text-3xl font-display text-gray-800 mt-4">
        {t('homepage:questionCarouselText')}
      </h1>

      <div className="text-center flex items-center justify-center w-full">
        <Carousel setApi={setApi} increment={1} rotateTime={25} buttons={false}>
          <CarouselContent>
            {images.map((image, index) => {
              return (
                <CarouselItem key={index}>
                  <div className="flex justify-center flex-col items-center m-4 relative group">
                    <div className="rounded-lg shadow-md w-[330px] md:w-[500px] lg:w-[800px] overflow-hidden relative">
                      <img
                        src={image.img}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-[180px] md:h-[280px] lg:h-[438px] object-fit"
                      />
                      <div className="flex flex-col bg-white h-[130px]">
                        <p className="text-lg font-display text-left pl-2 text-black md:text-xl">
                          {image.title}
                        </p>
                        <p className="text-sm font-display text-left pl-2 text-gray-600 md:text-lg">
                          {image.text}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Dot indicator */}
      <div className="pb-3">
        {count > 0 && (
          <div className="flex gap-2 my-2">
            {Array.from({ length: count }, (_, i) => {
              const slideIndex = i + 1;
              const isActive = slideIndex === current;

              return (
                <span
                  key={slideIndex}
                  className={cn(
                    'w-3 h-3 rounded-full transition-colors duration-300',
                    isActive ? 'bg-primary' : 'bg-gray-300'
                  )}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
