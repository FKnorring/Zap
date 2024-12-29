import { JeopardySlide } from '@/models/Quiz';

interface Props {
  slide: JeopardySlide;
}

const calculateScore = (index: number, minScore: number, maxScore: number) => {
  const step = (maxScore - minScore) / 4;
  return Math.round(minScore + (index * step));
};

export function Preview({ slide }: Props) {
  return (
    <div className="flex flex-col w-full h-full text-white p-8">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5 flex-1">
        {slide.categories.map((category) => (
          <div key={category.id} className="grid grid-rows-[auto_repeat(5,1fr)] gap-2.5">
            <div className="bg-black text-center text-4xl font-bold uppercase p-2.5 border-2 rounded-lg border-white min-h-[60px] flex items-center justify-center h-36">
              {category.name}
            </div>
            {category.questions.map((_, index) => (
              <div 
                key={index} 
                className="bg-black/75 border-2 border-white flex items-center justify-center text-6xl font-bold text-primary rounded-lg"
              >
                ${calculateScore(index, slide.minScore, slide.maxScore)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}