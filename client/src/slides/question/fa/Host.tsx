import { useCallback, useEffect, useMemo, useState } from 'react';
import { FASlide, Participant, ParticipantAnswer } from '@/models/Quiz';
import { Button } from '@/components/ui/button';
import Avatar, { genConfig } from 'react-nice-avatar';
import { X, Check } from 'lucide-react';
import { useAppContext } from '@/contexts/App/context';
import { usePathOnValue } from '@/hooks/usePathOnValue';
import { BaseQuestionRender } from '../base/QuestionRender';
import { useTranslation } from 'react-i18next';

export function Host({
  slide,
  participants,
  onNextSlide,
  quizCode,
}: {
  slide: FASlide;
  participants: Participant[];
  onNextSlide: () => void;
  quizCode: string;
}) {
  const [participantsQueue, setParticipantsQueue] = useState<Participant[]>([]);
  const { t } = useTranslation(['questions']);

  const {
    ongoingQuizzes: { resources: ongoingQuizzes, optimisticUpdate },
  } = useAppContext();

  const ongoingQuiz = useMemo(
    () => ongoingQuizzes.find((quiz) => quiz.id === quizCode),
    [ongoingQuizzes, quizCode]
  );
  if (!ongoingQuiz) return <h1>Loading quiz</h1>;
  const updateParticipants = useCallback(
    (id: string, participants: { [key: string]: Participant }) => {
      optimisticUpdate(
        id,
        {
          participants,
        },
        true
      );
    },
    [optimisticUpdate]
  );

  usePathOnValue<Participant>(
    `ongoingQuizzes/${quizCode}/participants`,
    (participants) => {
      if (!quizCode) return;
      updateParticipants(quizCode, participants);
    }
  );

  // Add participants once they have answered
  useEffect(() => {
    setParticipantsQueue([]);
    setParticipantsQueue((currentQueue) => {
      const updatedQueue = [...currentQueue];

      participants.forEach((newParticipant) => {
        const newParticipantId = newParticipant.participantId;

        if (
          !newParticipant.tempAnswer ||
          updatedQueue.some((p) => p.participantId === newParticipantId)
        ) {
          return;
        }

        const newTime = new Date(newParticipant.tempAnswer.time).getTime();

        let insertIndex = updatedQueue.findIndex(
          (queuedParticipant) =>
            new Date(
              queuedParticipant.tempAnswer?.time
                ? queuedParticipant.tempAnswer.time
                : ''
            ).getTime() > newTime
        );

        if (insertIndex === -1) {
          // If no larger time is found, insert at the end
          updatedQueue.push(newParticipant);
        } else {
          // Insert at the found index
          updatedQueue.splice(insertIndex, 0, newParticipant);
        }
      });

      return updatedQueue;
    });
  }, [participants]);

  function moveFirstParticipantToLast() {
    setParticipantsQueue((currentQueue) => {
      if (currentQueue.length > 1) {
        const updatedQueue = [...currentQueue];
        const firstParticipant = updatedQueue.shift();
        if (firstParticipant) {
          updatedQueue.push(firstParticipant);
        }
        return updatedQueue;
      }
      return currentQueue;
    });
  }

  const setAnswerCorrect = async (participant: Participant) => {
    const participantsObj = ongoingQuiz.participants;
    // If participant was already correct
    if (
      participant.answers &&
      participant.answers.at(-1)?.slideNumber == ongoingQuiz.currentSlide
    ) {
      return;
    }
    if (participantsObj) {
      const updatedAnswers = participant.answers
        ? [...participant.answers]
        : [];

      const correctAnswer: ParticipantAnswer = {
        answer: ['correct'],
        slideNumber: ongoingQuiz.currentSlide,
        time: participant.tempAnswer?.time ? participant.tempAnswer?.time : '',
      };
      updatedAnswers.push(correctAnswer);

      // Update participants
      const updatedParticipant: Participant = {
        ...participant,
        answers: updatedAnswers,
        hasAnswered: true,
      };
      const updatedQuiz = {
        ...ongoingQuiz,
        participants: {
          ...participantsObj,
          [participant.participantId]: updatedParticipant,
        },
      };
      try {
        await optimisticUpdate(quizCode, updatedQuiz);
      } catch (error) {
        console.error("Error updating participant's answer", error);
      }
    } else {
      console.error('No participants found');
    }
    moveFirstParticipantToLast();
  };

  return (
    <div>
      <BaseQuestionRender slide={slide} participants={participants} />
      <div className="flex flex-col items-center m-16 gap-10">
        <h1 className="text-6xl font-display">{t('nextUp')}</h1>
        {participantsQueue.slice(0, 3).map((participant, index) => (
          <div
            key={index}
            className="flex flex-row justify-center items-center gap-16"
          >
            {index == 0 && (
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center p-0 [&_svg]:size-8"
                  onClick={() => moveFirstParticipantToLast()}
                >
                  <X />
                </Button>
                <h1 className="text-1xl font-display">{t('wrongAnswer')}</h1>
              </div>
            )}
            <div className="flex flex-col items-center justify-center p-4 rounded-lg animate-[zoom-in_1s_ease-in-out] ">
              <Avatar
                style={{
                  width:
                    index === 0 ? '10rem' : index === 1 ? '5rem' : '4.5rem',
                  height:
                    index === 0 ? '10rem' : index === 1 ? '5rem' : '4.5rem',
                }}
                {...genConfig(participant.avatar ? participant.avatar : '')}
              />
              <span
                className={`${
                  index === 0
                    ? 'text-5xl font-bold'
                    : index === 1
                    ? 'text-2xl font-medium'
                    : 'text-xl font-normal'
                } font-display`}
              >
                {participant.name}
              </span>
            </div>
            {index == 0 && (
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center p-0 [&_svg]:size-8"
                  onClick={() => {
                    setAnswerCorrect(participant);
                  }}
                >
                  <Check />
                </Button>
                <h1 className="text-1xl font-display">{t('rightAnswer')}</h1>
              </div>
            )}
          </div>
        ))}
      </div>
      <Button onClick={onNextSlide} className="absolute bottom-5 right-5">
        Next Slide
      </Button>
    </div>
  );
}
