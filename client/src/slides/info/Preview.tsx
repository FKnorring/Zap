import { InfoSlide } from '@/models/Quiz';
import { Render } from './Render';

export function Preview({
  slide,
  onSlideUpdate,
}: {
  slide: InfoSlide;
  onSlideUpdate: (slide: InfoSlide) => void;
}) {
  return <Render slide={slide} isEditable onSlideUpdate={onSlideUpdate} />;
}
