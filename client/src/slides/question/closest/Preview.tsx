import { ClosestSlide } from '@/models/Quiz';
import SlideTitleSpecial from '@/slides/_components/SlideTitleSpecial';

import { Target } from 'lucide-react';
interface PreviewProps {
  slide: ClosestSlide;
}

export function Preview({ slide }: PreviewProps) {

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
     
      <div className="flex flex-col items-center justify-center p-8 space-y-5 bg-white rounded-lg">
        <SlideTitleSpecial title={slide.title} icon={Target} />
      </div>

    </div>
  );
} 