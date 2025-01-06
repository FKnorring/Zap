import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

type ImageItem = {
  img: string;
  text: string;
};

type QuestionCarouselProps = {
  images: ImageItem[];
  titles: string[];
};

const QuestionCarousel: React.FC<QuestionCarouselProps> = ({
  images,
  titles,
}) => {
  return (
    <div className="flex flex-col justify-center items-center w-full bg-[#F4F4F4]">
      <h1 className="text-3xl font-display text-black mt-4">
        Press the question types!
      </h1>
      <div className="text-center flex items-center justify-center w-full">
        <Carousel increment={1} rotateTime={15} buttons={false}>
          <CarouselContent>
            {images.map((_, groupIndex) => {
              const imageGroup =
                window.innerWidth < 640
                  ? images.slice(groupIndex, groupIndex + 1) // One item per slide on small screens
                  : images.slice(groupIndex * 3, groupIndex * 3 + 3); // Three items per slide on larger screens

              if (imageGroup.length === 0) return null;

              return (
                <CarouselItem className="border-white m-4" key={groupIndex}>
                  <div className="flex justify-center">
                    {imageGroup.map((image, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center m-4 relative group"
                      >
                        <h2 className="text-xl font-display mb-2 text-black">
                          {
                            titles[
                              groupIndex * (window.innerWidth < 640 ? 1 : 3) +
                                index
                            ]
                          }
                        </h2>
                        <div className="rounded-lg border-4 border-white w-full max-w-xs sm:max-w-md mx-4 sm:mx-6 overflow-hidden relative">
                          <img
                            src={image.img}
                            alt={`Slide ${
                              groupIndex * (window.innerWidth < 640 ? 1 : 3) +
                              index +
                              1
                            }`}
                            className="w-full h-auto object-cover transition-all duration-300 group-hover:blur-sm"
                          />
                          <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <p className="text-lg font-medium text-center m-2">
                              {image.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default QuestionCarousel;
