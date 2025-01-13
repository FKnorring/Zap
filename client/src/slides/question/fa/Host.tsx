import { useCallback, useEffect, useMemo, useState } from 'react';
import { FASlide, Participant } from '@/models/Quiz';
import { Button } from '@/components/ui/button';
import Avatar from '@/Avatar';
import { X, Check } from 'lucide-react';
import { useAppContext } from '@/contexts/App/context';
import { usePathOnValue } from '@/hooks/usePathOnValue';
import { BaseQuestionRender } from '../base/QuestionRender';
import { useTranslation } from 'react-i18next';
import NextSlide from '@/slides/_components/NextSlide';
import Spinner from '@/components/Spinner';

export function Host({
  slide,
  participants,
  onNextSlide,
  onPrevSlide,
  endQuiz,
  answerTempQuestion,
  quizCode,
}: {
  slide: FASlide;
  participants: Participant[];
  onNextSlide: () => void;
  onPrevSlide: () => void;
  endQuiz: (quizCode: string) => Promise<boolean>;
  answerTempQuestion: (participantId: string, quizCode: string) => void;
  quizCode: string;
}) {
  const [participantsQueue, setParticipantsQueue] = useState<Participant[]>([]);
  const { t } = useTranslation(['questions']);
  const [time, setTime] = useState(10);
  useEffect(() => {
    if (time <= 0) return;
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);
  const {
    ongoingQuizzes: { resources: ongoingQuizzes, optimisticUpdate },
  } = useAppContext();

  const ongoingQuiz = useMemo(
    () => ongoingQuizzes.find((quiz) => quiz.id === quizCode),
    [ongoingQuizzes, quizCode]
  );
  if (!ongoingQuiz) return <Spinner />;
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



  function removeFromQueue(participantId: string) {
    answerTempQuestion
    setParticipantsQueue((currentQueue) => {
      return currentQueue.filter(
        (participant) => participant.participantId !== participantId
      );
    });
  }

  const setAnswerCorrect = async (participant: Participant) => {
    const participantsObj = ongoingQuiz.participants;

    const updatedParticipants = Object.entries(participantsObj).reduce(
      (acc, [id, p]) => {
        const answers = p.answers ? [...p.answers] : [];
        answers.push({
          answer: id === participant.participantId ? ['correct'] : [''],
          slideNumber: ongoingQuiz.currentSlide - 1,
          time: p.tempAnswer?.time || new Date().toISOString(),
        });

        acc[id] = {
          ...p,
          answers,
          hasAnswered: true,
        };
        return acc;
      },
      {} as Record<string, Participant>
    );

    try {
      await optimisticUpdate(quizCode, {
        ...ongoingQuiz,
        participants: updatedParticipants,
      });
    } catch (error) {
      console.error("Error updating participant's answer", error);
    }
  };
  if (time > 0) {
    return (
      <div className="flex flex-1 flex-col text-center justify-center gap-20">
        <div>
          <h1 className="font-display text-9xl justify-center">
            {t('getReady')}
            {time}
          </h1>
        </div>
        <h1 className="font-display text-6xl">{t('knowTheAnswer')}</h1>
      </div>
    );
  } else {
    return (
      <div>
        <BaseQuestionRender slide={slide} />
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
                    onClick={() => removeFromQueue(participantsQueue[0].participantId)}
                  >
                    <X />
                  </Button>
                  <h1 className="text-1xl font-display mt-2">
                    {t('wrongAnswer')}
                  </h1>
                </div>
              )}
              <div className="flex flex-col items-center justify-center p-4 rounded-lg animate-[zoom-in_1s_ease-in-out] ">
                <Avatar
                  width={
                    index === 0 ? '10rem' : index === 1 ? '5rem' : '4.5rem'
                  }
                  height={
                    index === 0 ? '10rem' : index === 1 ? '5rem' : '4.5rem'
                  }
                  avatarString={participant.avatar}
                  collectionName={participant.collectionName}
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
                  <h1 className="text-1xl font-display mt-2">
                    {t('rightAnswer')}
                  </h1>
                </div>
              )}
            </div>
          ))}
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
}
