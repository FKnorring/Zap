import { BombSlide } from '@/models/Quiz';
import NextSlide from '@/slides/_components/NextSlide';
import { BombIcon } from 'lucide-react';
import Avatar from '@/Avatar';
import type { Participant } from '@/models/Quiz';
import { useTranslation } from 'react-i18next';

export function HostAnswer({
  participants,
  onNextSlide,
  slide,
}: {
  slide: BombSlide;
  participants: Participant[];
  onNextSlide: () => void;
}) {
  // Find the highest answer and collect participants with that answer
  const { t } = useTranslation();
  let highestAnswer = -Infinity;
  let winningParticipants: Participant[] = [];

  participants.forEach((participant) => {
    const lastAnswer = participant.answers[participant.answers.length - 1];

    if (parseInt(lastAnswer.answer[0]) > highestAnswer) {
      // If the current answer is higher, reset the winners list
      highestAnswer = parseInt(lastAnswer.answer[0]);
      winningParticipants = [participant]; // New winner
    } else if (parseInt(lastAnswer.answer[0]) === highestAnswer) {
      // If the current answer matches the highest, add to winners list
      winningParticipants.push(participant);
    }
  });

  return (
    <div className="flex flex-col items-center h-full p-10 w-full">
      <div className="mt-10 rounded-lg bg-[#F4F3F2] text-black mb-4 flex justify-center font-display text-4xl items-center max-w-[60%] break-words text-center">
        <BombIcon size={32} className="ml-4" />
        <h1 className="p-4">{slide.title}</h1>
      </div>

      <div className="mt-10 text-black grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full overflow-y-auto max-h-96">
        {slide.answers.map((answer, index) => (
          <div
            key={index}
            className={`m-1 flex flex-col items-center justify-center p-4 rounded-lg shadow-md ${
              slide.usedAnswers
                ? slide.usedAnswers.includes(answer)
                  ? 'bg-green-600 '
                  : 'bg-component-background'
                : 'bg-component-background'
            }`}
          >
            <span className="text-3xl font-display">{answer}</span>
          </div>
        ))}
      </div>

      {/* Render the avatars of the winning participants */}
      <div className="flex flex-col items-center h-full p-10 w-full">
        <div className="flex gap-4">
          {participants.slice(0, 5).map((participant) => (
            <div
              className="mx-4 flex flex-col items-center h-full"
              key={participant.participantId}
            >
              <h1 className="m-4 text-3xl font-display">
                {winningParticipants.includes(participant)
                  ? t('question:winner')
                  : '💀'}
              </h1>
              <Avatar
                width={'8rem'}
                height={'8rem'}
                avatarString={participant.avatar}
                collectionName={participant.collectionName}
              ></Avatar>
              <h1 className="font-display text-2xl mt-2">
                + {participant.score.at(-1)}
              </h1>
            </div>
          ))}
        </div>
      </div>

      <NextSlide onClick={onNextSlide} />
    </div>
  );
}
