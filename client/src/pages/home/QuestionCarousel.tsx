import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import jeopardy from '@/assets/questionImages/jeopardy.png';
import fa from '@/assets/questionImages/fa.png';
import locateit from '@/assets/questionImages/locateit.png';
import match from '@/assets/questionImages/match.png';
import rank from '@/assets/questionImages/rank.png';
import { LocateIt, Matching, Rank, FA, Jeopardy } from '@/slides';

export default function QuestionCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const { t } = useTranslation();

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const images = [
    {
      img: locateit,
      title: t('questions:LOCATEIT'),
      text: t('homepage:questionDescriptions.locateit'),
      icon: LocateIt.Info.icon,
      iconColor: LocateIt.Info.iconColor,
    },
    {
      img: fa,
      title: t('questions:FA'),
      text: t('homepage:questionDescriptions.fastest'),
      icon: FA.Info.icon,
      iconColor: FA.Info.iconColor,
    },
    {
      img: match,
      title: t('questions:MATCHING'),
      text: t('homepage:questionDescriptions.matching'),
      icon: Matching.Info.icon,
      iconColor: Matching.Info.iconColor,
    },
    {
      img: jeopardy,
      title: t('questions:JEOPARDY'),
      text: t('homepage:questionDescriptions.jeopardy'),
      icon: Jeopardy.Info.icon,
      iconColor: Jeopardy.Info.iconColor,
    },
    {
      img: rank,
      title: t('questions:RANK'),
      text: t('homepage:questionDescriptions.rank'),
      icon: Rank.Info.icon,
      iconColor: Rank.Info.iconColor,
    },
    /*{
      img: dallebomb,
      title: t('questions:BOMB'),
      text: t('homepage:questionDescriptions.bomb'),
      icon: Bomb.Info.icon,
      iconColor: Bomb.Info.iconColor,
    },*/
  ];

  return (
    <div className="flex flex-col justify-center items-center w-full bg-[#F4F4F4]">
      <h1 className="text-3xl font-display text-gray-700 mt-4 md:text-5xl">
        {t('homepage:questionCarouselText')}
      </h1>

      {/* Icon navigation */}

      {count > 0 && (
        <div className="flex gap-4 my-4">
          {images.map((image, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)} // Navigate to the selected image
              className={cn(
                'p-2 rounded-full transition-colors duration-200 ease-in transform ',
                current === i
                  ? 'bg-primary text-white scale-110'
                  : 'bg-gray-200 text-black'
              )}
              aria-label={`Go to ${image.title}`}
            >
              {
                <image.icon
                  size={25}
                  strokeWidth={2}
                  color={current === i ? 'white' : image.iconColor}
                />
              }
            </button>
          ))}
        </div>
      )}

      <div className="w-full pb-3">
        <Carousel
          setApi={setApi}
          increment={1}
          rotateTime={250}
          buttons={false}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="flex justify-center flex-col items-center m-4 relative group">
                  <div className="rounded-lg shadow-md w-[330px] md:w-[500px] lg:w-[800px] overflow-hidden relative">
                    <img
                      src={image.img}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-[160px] md:h-[240px] lg:h-[370px] object-cover"
                    />
                    <div className="flex flex-col bg-white h-[130px] md:h-[160px] lg:h-[180px] p-3 ">
                      <p className="text-lg font-display text-left text-black md:text-xl lg:text-2xl">
                        {image.title}
                      </p>
                      <p className="text-sm font-display text-left text-gray-600 md:text-lg lg:text-xl pt-0">
                        {image.text}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
