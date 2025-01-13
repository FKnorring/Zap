import { RankSlide, Participant } from '@/models/Quiz';
import NextSlide from '@/slides/_components/NextSlide';
import { SlideContent } from '@/slides/_components/SlideContent';
import SlideTitleSpecial from '@/slides/_components/SlideTitleSpecial';
import { getSlideComponents } from '@/slides/utils';
import { useTranslation } from 'react-i18next';
import { Smartphone } from 'lucide-react';

export function Host({
  slide,
  onNextSlide,
  onPrevSlide,
  endQuiz,
  quizCode,
}: {
  slide: RankSlide;
  participants: Participant[];
  onNextSlide: () => void;
  onPrevSlide: () => void;
  endQuiz: (quizCode: string) => Promise<boolean>;
  quizCode: string;
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
      <SlideContent content={slide.content} />
      <div></div>
      <span className="font-display text-6xl mt-10">
        {t('lookAtYourScreen')}
      </span>

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
       <h1 className='text-2xl font-display mt-4'>Look at your phone!</h1>
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
