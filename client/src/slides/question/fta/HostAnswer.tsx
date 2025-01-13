import { useState } from 'react';
import { FTASlide, Participant } from '@/models/Quiz';
import Avatar from '@/Avatar';
import { stringSimilarity } from 'string-similarity-js';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';


export function HostAnswer({
  slide,
  participants = [],
  
 
}: {
  slide: FTASlide;
  participants: Participant[];
  onPrevSlide: () => void;
  endQuiz: (quizCode: string) => Promise<boolean>;
  quizCode: string;

  handleAddPoints: (
    pointsData: { participantId: string; awardPoints: number }[],
    showAnswer: boolean,
    changeSlide: boolean
  ) => void;
}) {
  const [latestAnswers, setLatestAnswers] = useState(() =>
    participants.map((participant) => {
      const latestAnswer =
        participant.answers.length > 0
          ? participant.answers[participant.answers.length - 1].answer
          : '??';
      const similarity = stringSimilarity(latestAnswer[0], slide.correctAnswer);
      return {
        name: participant.name,
        avatar: participant.avatar,
        collectionName: participant.collectionName,
        id: participant.participantId,
        answer: latestAnswer,
        points: similarity >= 0.97 ? slide.points : 0,
      };
    })
  );

  const togglePoints = (participantId: string) => {
    setLatestAnswers((prevAnswers) =>
      prevAnswers.map((entry) =>
        entry.id === participantId
          ? { ...entry, points: entry.points === 0 ? slide.points : 0 }
          : entry
      )
    );
  };

  
  return (
    <div className="flex flex-col items-center">
      {/* Slide Title */}
      <div className="bg-white rounded p-4 mb-10 mt-20 text-wrap text-center">
        <h1 className="text-5xl text-black font-display">
          Correct Answer:{' '}
          <span className="bg-green-500 text-white px-2 py-1 rounded">
            {slide.correctAnswer}
          </span>
        </h1>
      </div>

      {/* Display Participants' Latest Answers */}
      <div className="flex flex-wrap gap-4 justify-center">
        {latestAnswers.map((entry, index) => (
          <div
            key={index}
            className="max-w-xl bg-white rounded p-4 flex flex-col items-center shadow-md space-y-3"
          >
            <div className="flex items-center">
              <Avatar
                width={'2.5rem'}
                height={'2.5rem'}
                avatarString={entry.avatar}
                collectionName={entry.collectionName}
              />
              <h1 className="text-3xl font-display text-black pl-1">
                {entry.name}
              </h1>
            </div>
            <div className="w-full text-center">
              <h1
                className="font-display text-gray-600 pl-1 text-wrap"
                style={{
                  fontSize: `${Math.max(2.5 - entry.answer.length / 1, 2.5)}rem`,
                }}
              >
                {entry.answer}
              </h1>
            </div>

            <div
              className={cn('flex items-center space-x-2 p-2 rounded-md', {
                'bg-green-500 text-white': entry.points,
                'bg-white text-black ': !entry.points,
              })}
            >
              <Label
                htmlFor={entry.id}
                className="cursor-pointer font-display text-2xl"
              >
                Award points
              </Label>
              <Checkbox
                id={entry.id}
                checked={entry.points !== 0}
                onCheckedChange={() => togglePoints(entry.id)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Next Slide Button */}
    </div>
  );
}
