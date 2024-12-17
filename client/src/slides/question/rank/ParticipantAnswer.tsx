import { Participant, RankSlide } from '@/models/Quiz';
import RenderCorrectIncorrect from '../base/RenderCorrectIncorrect';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

export function ParticipantAnswer({
  slide,
  participant,
}: {
  slide: RankSlide;
  participant: Participant;
}) {
  const correctAnswer = slide.ranking;
  const latestAnswer = participant.answers?.at(-1)?.answer;


  return (
    <RenderCorrectIncorrect participant={participant}>
      <div className='mb-4'>
        <div className="flex flex-col items-center gap-2 max-h-72 overflow-y-auto">
          {latestAnswer?.map((text, index) => {
            const correct = text == correctAnswer[index];
            const bgColor = correct ? 'bg-green-200' : 'bg-red-200';
            return (
              <div key={index} className="flex items-center w-full">
                <div
                  className={cn("bg-white flex justify-center items-center w-full p-1 px-3 rounded-lg text-xl font-display text-black", bgColor)}
                >
                  <span className='mr-2'>{text}</span>
                  {correct ?  <Check width={20} height={20} /> : <X width={20} height={20} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </RenderCorrectIncorrect>
  );
}
