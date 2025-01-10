import { BulletPointSlide } from '@/models/Quiz';
import { Render } from './Render';

export function Preview({
  slide,
  onSlideUpdate,
}: {
  slide: BulletPointSlide;
  onSlideUpdate: (slide: BulletPointSlide) => void;
}) {
  return <Render slide={slide} onSlideUpdate={onSlideUpdate} isEditable />;
}
