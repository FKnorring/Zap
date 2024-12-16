import { BombSlide } from '@/models/Quiz';
import NextSlide from '@/slides/_components/NextSlide';
import { BombIcon } from 'lucide-react';
import Avatar, { genConfig } from 'react-nice-avatar';
import type { Participant } from '@/models/Quiz';

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
            className={`flex flex-col items-center justify-center p-4 rounded-lg shadow-md ${
              slide.usedAnswers
                ? slide.usedAnswers.includes(answer)
                  ? 'bg-green-400'
                  : 'bg-component-background'
                : 'bg-component-background'
            }`}
          >
            <span className="text-lg font-semibold">{answer}</span>
          </div>
        ))}
      </div>

      {/* Render the avatars of the winning participants */}
      <div className="flex flex-col items-center h-full p-10 w-full">
        <h1 className="m-4 text-3xl font-display">
          {winningParticipants.length > 1 ? 'Winners!' : 'Winner!'}
        </h1>
        <div className="flex gap-4">
          {winningParticipants.map((participant) => (
            <Avatar
              key={participant.participantId}
              style={{
                width: '8rem',
                height: '8rem', // Ensure avatar size is big
              }}
              {...genConfig(participant.avatar)} // Use avatar of the winning participant
            />
          ))}
        </div>
      </div>

      <NextSlide onClick={onNextSlide} />
    </div>
  );
}
