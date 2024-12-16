import { AwardPointsLocation, LocateItSlide } from '@/models/Quiz';
import markerIcon from '@/assets/markerIcon.png';
import NextSlide from '@/slides/_components/NextSlide';
import { useTranslation } from 'react-i18next';

export function Host({
  slide,
  onNextSlide,
}: {
  slide: LocateItSlide;
  onNextSlide: () => void;
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
      <p className="font-display text-6xl">
        {slide.awardPointsLocation == AwardPointsLocation.CLOSEST
          ? t('closestWinsDescription')
          : slide.awardPointsLocation == AwardPointsLocation.DISTANCE
            ? t('closestWinsDescription')
            : t('insideRadius')}
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
      <NextSlide onClick={onNextSlide} />
    </div>
  );
}
