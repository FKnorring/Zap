import { AwardPointsLocation, LocateItSlide } from '@/models/Quiz';
import markerIcon from '@/assets/markerIcon.png';
import NextSlide from '@/slides/_components/NextSlide';
import { useTranslation } from 'react-i18next';
import { InfoIcon } from 'lucide-react';
import { Smartphone } from 'lucide-react';

export function Host({
  slide,
  onNextSlide,
  onPrevSlide,
  endQuiz,
  quizCode,
}: {
  slide: LocateItSlide;
  onNextSlide: () => void;
  onPrevSlide: () => void;
  endQuiz: (quizCode: string) => Promise<boolean>;
  quizCode: string;
}) {
  const { t } = useTranslation(['quizEditor']);

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white rounded p-4 mb-10 mt-20 text-wrap text-center flex-col flex items-center ">
        <div className="flex flex-row items-center">
          <img
            src={markerIcon}
            alt="Marker Icon"
            className="w-20 h-20 rounded-full "
          />
          <h1 className="text-7xl text-black font-display">{slide.title}</h1>
        </div>

        <p className="text-black font-display text-3xl">{slide.content}</p>
      </div>
      <p className="font-display text-xl items-center flex">
        <InfoIcon size={20} className="inline mr-2" />
        {slide.awardPointsLocation == AwardPointsLocation.CLOSEST
          ? t('closestWinsDescription')
          : slide.awardPointsLocation == AwardPointsLocation.DISTANCE
            ? t('distanceDescription')
            : t('insideRadiusDescription')}
      </p>
      {slide.imageUrl && (
        <div className="flex justify-center">
          <div className="relative flex items-center justify-center">
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="w-auto object-contain"
              style={{
                height: `${(slide.imageScale || 1) * 400}px`,
                transition: 'height 0.2s ease-out',
              }}
            />
          </div>
        </div>
      )}
      <h1 className="text-2xl font-display mt-4">Look at your phone!</h1>
      <Smartphone size={128} color="white"></Smartphone>
      <NextSlide
        quizCode={quizCode}
        endQuiz={() => endQuiz(quizCode)} // Corrected here
        onPrev={onPrevSlide}
        onNext={onNextSlide}
      />
    </div>
  );
}
