import { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { FaLinkedin } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import lisa from '@/assets/photos/lisa.jpeg';
import nils from '@/assets/photos/nils.jpeg';
import ramez from '@/assets/photos/ramez.jpeg';
import jacob from '@/assets/photos/jacob.jpeg';
import filip from '@/assets/photos/filip.jpeg';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function LinkedInPhone() {
  const { t } = useTranslation();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const people = [
    {
      src: lisa,
      name: 'Lisa Hansson',
      linkedin: 'https://www.linkedin.com/in/lisa-hansson/',
    },
    {
      src: nils,
      name: 'Nils Persson',
      linkedin: 'https://www.linkedin.com/in/nils-albin-persson/',
    },
    {
      src: ramez,
      name: 'Ramez Shakarna',
      linkedin: 'https://www.linkedin.com/in/ramezshakarna/',
    },
    {
      src: filip,
      name: 'Filip von Knorring',
      linkedin: 'https://www.linkedin.com/in/filip-v-4b9976139/',
    },
    {
      src: jacob,
      name: 'Jacob Dillström',
      linkedin: 'https://www.linkedin.com/in/jacob-dillstrom/',
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center w-full bg-[#F9F8FE] py-6 px-4">
      {/* Section Heading */}
      <h1 className="text-2xl font-display text-gray-800 mb-4">
        {t('about:team')}
      </h1>

      {/* Carousel */}
      <div className="w-full">
        <Carousel setApi={setApi} increment={1} rotateTime={3} buttons={false}>
          <CarouselContent>
            {people.map((person, index) => (
              <CarouselItem key={index}>
                <div className="flex flex-col items-center bg-white rounded-lg shadow-sm overflow-hidden w-[250px] mx-auto mb-1">
                  <img
                    src={person.src}
                    alt={person.name}
                    className="h-[250px] object-cover"
                  />
                  <div className="p-4 text-center">
                    <a
                      href={person.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 hover:text-blue-600"
                    >
                      <FaLinkedin size={24} color="#0A66C2" />
                      <p className="text-lg font-display text-gray-700">
                        {person.name}
                      </p>
                    </a>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Dot Indicator */}
      {count > 0 && (
        <div className="flex gap-2 mt-4">
          {Array.from({ length: count }, (_, i) => {
            const slideIndex = i + 1;
            const isActive = slideIndex === current;

            return (
              <span
                key={slideIndex}
                className={cn(
                  'w-3 h-3 rounded-full transition-colors duration-300 transform',
                  isActive ? 'bg-primary scale-110' : 'bg-gray-300'
                )}
              />
            );
          })}
        </div>
      )}
      <div className="text-center mt-8">
        <Link to="/about">
          <Button
            variant={location.pathname === '/about' ? 'default' : 'ghost'}
            className=" mb-5 bg-primary p-4 text-2xl font-display text-gray-800"
          >
            {t('homepage:readmore')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
