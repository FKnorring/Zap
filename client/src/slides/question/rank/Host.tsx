import { RankSlide, Participant } from '@/models/Quiz';
import NextSlide from '@/slides/_components/NextSlide';
import SlideTitleSpecial from '@/slides/_components/SlideTitleSpecial';
import { getSlideComponents } from '@/slides/utils';
import { useTranslation } from 'react-i18next';

export function Host({
  slide,
  onNextSlide,
}: {
  slide: RankSlide;
  participants: Participant[];
  onNextSlide: () => void;
}) {
  const SlideComponent = getSlideComponents(slide);
  const { t } = useTranslation(['questions']);

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white rounded p-4 mb-10 mt-20 text-wrap text-center flex-row flex items-center">
        <SlideTitleSpecial
          title={slide.title}
          icon={SlideComponent.Info.icon}
        />
      </div>
      <span className="font-display text-6xl">{t('lookAtYourScreen')}</span>
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
