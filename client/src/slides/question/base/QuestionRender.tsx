import { QuestionSlide } from '@/models/Quiz';
import { SlideTitle } from '@/slides/_components/SlideTitle';
import { SlideContent } from '@/slides/_components/SlideContent';
export function BaseQuestionRender({
  slide,
  children,
}: {
  slide: QuestionSlide;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col space-y-12 w-full justify-center mb-10">
      <div className="flex flex-row justify-center items-center">
        <div className="space-y-8">
          <div className="flex flex-row justify-center pt-32 ">
            <SlideTitle title={slide.title} />
          </div>

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
          <SlideContent content={slide.content} />
        </div>
      </div>
      {children}
    </div>
  );
}
