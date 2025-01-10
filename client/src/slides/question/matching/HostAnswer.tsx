import { Participant, MatchingSlide } from '@/models/Quiz';
import NextSlide from '@/slides/_components/NextSlide';
import { SlideTitle } from '@/slides/_components/SlideTitle';
import { getColor } from '../base/QuizColors';
import { cn } from '@/lib/utils';
import MatchGroup from './MatchGroup';
import { CalculateScore } from './CalculateScore';

export function HostAnswer({
  slide,
  participants,
  onNextSlide,
  onPrevSlide,
  endQuiz,
  quizCode,
}: {
  slide: MatchingSlide;
  participants: Participant[];
  onNextSlide: () => void;
  onPrevSlide: () => void;
  endQuiz: (quizCode: string) => Promise<boolean>;
  quizCode: string;
}) {
  if (!slide || !slide.options || !slide.labels) {
    console.error('Invalid slide data:', slide);
    return <div>Error: Slide data is missing or invalid</div>;
  }

  if (!participants) {
    console.error('Participants data is missing');
    return <div>Error: Participants data is missing</div>;
  }

  const unAssignedOptions = slide.options.filter(
    (option) =>
      !slide.labels.some((label) => label?.correctOptions?.includes(option))
  );

  const cols = slide.labels.length + (unAssignedOptions.length > 0 ? 1 : 0);
  const answers = participants
    .filter(
      (participant) => participant.answers && participant.answers.length > 0
    )
    .map((participant) => participant.answers[participant.answers.length - 1]);

  const scores = CalculateScore({ slide, participants });
  const totalParticipants = participants.length;
  const perfectScores = scores.filter((score) => score === slide.points).length;

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8">
      <SlideTitle title={slide.title} />
      <h2 className="text-2xl font-bold">
        {perfectScores} out of {totalParticipants} got all matches correct
      </h2>
      <div
        className={cn(
          'w-full grid grid-cols-2 gap-8 px-16',
          cols == 3 && 'grid-cols-3',
          cols == 4 && 'grid-cols-4'
        )}
      >
        {slide.labels.map((label, idx) => (
          <MatchGroup
            key={label.id}
            title={label.text}
            options={label.correctOptions}
            answers={answers as never}
            labelId={label.id}
            totalParticipants={totalParticipants}
            background={getColor(idx)}
          />
        ))}
        {unAssignedOptions.length > 0 && (
          <MatchGroup
            title="No Match!"
            options={unAssignedOptions}
            answers={answers as never}
            labelId="unassigned"
            totalParticipants={totalParticipants}
            background="rgb(107 114 128)"
          />
        )}
      </div>
      <NextSlide
        quizCode={quizCode}
        endQuiz={() => endQuiz(quizCode)} // Corrected here
        onPrev={onPrevSlide}
        onNext={onNextSlide}
      />
    </div>
  );
}
