import { FASlide } from '@/models/Quiz';
import NextSlide from '@/slides/_components/NextSlide';
import { useTranslation } from 'react-i18next';

export function HostAnswer({
  slide,
  onNextSlide,
}: {
  slide: FASlide;
  onNextSlide: () => void;
}) {
  const { t } = useTranslation(['questions']);
  return (
    <div className="flex flex-1">
      <div className="flex-1 flex flex-col items-center gap-28 justify-center">
        <h1 className="text-5xl font-display">{t('correctAnswer')} ...</h1>
        <h1 className="text-9xl font-display">{slide.correctAnswer}</h1>
      </div>

      <NextSlide onClick={onNextSlide} />
    </div>
  );
}
