import { useCallback, useEffect, useMemo } from 'react';
import { useAppContext } from '@/contexts/App/context';
import { usePathOnValue } from '@/hooks/usePathOnValue';
import {
  QuestionSlide,
  SlideTypes,
  ShowCorrectAnswerTypes,
  Participant,
  Slide,
  LobbySlide,
  QuestionTypes,
} from '@/models/Quiz';
import { getSlideComponents } from '@/slides/utils';
import { database } from '@/firebase';
import { ref, update } from 'firebase/database';

export interface LatestScore {
  id: string;
  score: number[];
}

export const useHostLogic = (id: string | undefined) => {
  const {
    ongoingQuizzes: { resources: ongoingQuizzes, endQuiz, optimisticUpdate },
  } = useAppContext();

  const ongoingQuiz = useMemo(
    () => ongoingQuizzes.find((quiz) => quiz.id === id),
    [ongoingQuizzes, id]
  );

  const removeParticipant = useCallback(
    (participantId: string) => {
      if (!ongoingQuiz) return;
      optimisticUpdate(ongoingQuiz.id, {
        participants: Object.entries(ongoingQuiz.participants || {}).reduce((acc, [id, participant]) => {
          if (id === participantId) {
            return acc;
          }
          return {
            ...acc,
            [id]: participant,
          };
        }, {} as { [key: string]: Participant }),
      });
    },
    [optimisticUpdate, ongoingQuiz]
  );

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
    `ongoingQuizzes/${id}/participants`,
    (participants) => {
      if (!id) return;
      updateParticipants(id, participants);
    }
  );

  const { participants } = ongoingQuiz || {};

  const allAnswered = Object.values(participants || {}).every(
    (participant) => participant.hasAnswered
  );

  const updateScores = async (slide: Slide, showAnswer: boolean) => {
    console.log('Inne i updatescore');
    if (slide.type !== SlideTypes.question) return {};
    const questionSlide = slide as QuestionSlide;
    if (questionSlide.questionType == QuestionTypes.FTA) return {};
    const slidecomponent = getSlideComponents(slide);

    if ('CalculateScore' in slidecomponent) {
      const participants = Object.values(ongoingQuiz?.participants || {});
      const points = slidecomponent.CalculateScore({
        slide: slide as never,
        participants,
        currentSlideTime: ongoingQuiz?.currentSlideTime,
      });

      const updateParticipants = await handleAddPoints(
        points.map((point, index) => ({
          participantId: participants[index].participantId,
          awardPoints: point,
        })),
        showAnswer
      );
      console.log('innan return');
      return updateParticipants;
    } else return ongoingQuiz?.participants ? ongoingQuiz.participants : {};
  };

  const handleAddPoints = async (
    pointsData: { participantId: string; awardPoints: number }[],
    showAnswer: boolean,
    changeSlide?: boolean 
  ) => {
    const participants = { ...ongoingQuiz!.participants };

    pointsData.forEach((point) => {
      participants[point.participantId] = {
        ...participants[point.participantId],
        score: [
          ...(participants[point.participantId].score || []),
          point.awardPoints,
        ],
        hasAnswered: false,
      };
    });
    console.log('changeSlide', changeSlide);
    if(changeSlide) {
      console.log('changeSlide');
      await optimisticUpdate(ongoingQuiz!.id, {
        ...ongoingQuiz,
        participants,
        currentSlide: ongoingQuiz!.currentSlide + 1,
        isShowingCorrectAnswer: false,
      });
    } else {
    await optimisticUpdate(ongoingQuiz!.id, {
      ...ongoingQuiz,
      participants,
      isShowingCorrectAnswer: showAnswer,
    });
  }
    
    return participants;
  };

  const addMissingAnswers = async () => {
    if (
      !ongoingQuiz ||
      ongoingQuiz.currentSlide == 0 ||
      !ongoingQuiz.participants
    )
      return;
    Object.entries(ongoingQuiz.participants).forEach(
      async ([id, participant]) => {
        if (
          !participant.answers ||
          participant.answers.at(-1)?.slideNumber !==
            ongoingQuiz.currentSlide - 1
        ) {
          var updatedParticipants = ongoingQuiz.participants;
          const currentSlide  = getCurrentSlide() as QuestionSlide;

          let newAnswer = {
            answer: [''],
            slideNumber: ongoingQuiz.currentSlide - 1,
            time: new Date().toISOString(),
          }
          if(currentSlide.questionType == QuestionTypes.LOCATEIT) {
            newAnswer = {
              answer: ['-83','160'],
              slideNumber: ongoingQuiz.currentSlide - 1,
              time: new Date().toISOString(),
            }
          }
          if (!participant.answers) {
            updatedParticipants[id].answers = [newAnswer];
          } else {
            updatedParticipants[id].answers.push(newAnswer);
          }
          try {
            await optimisticUpdate(ongoingQuiz.id, {
              ...ongoingQuiz,
              participants: updatedParticipants,
            });
          } catch (error) {
            console.error(
              `Failed to add missing answers to participants`,
              error
            );
          }
        }
      }
    );
  };

  const nextSlide = async () => {
    if (!ongoingQuiz) return;

    const currentSlide = getCurrentSlide();

    const showAnswer =
      !ongoingQuiz.isShowingCorrectAnswer &&
      currentSlide?.type == SlideTypes.question &&
      currentSlide.showCorrectAnswer != ShowCorrectAnswerTypes.never;

    var updatedParticipants = ongoingQuiz.participants;
    if (!ongoingQuiz.isShowingCorrectAnswer) {
      await addMissingAnswers();
      if (currentSlide) {
        const tempParticipants = await updateScores(currentSlide, showAnswer);
        if (Object.keys(tempParticipants).length != 0) {
          updatedParticipants = tempParticipants;
        }
      }
    }
    updatedParticipants = Object.entries(updatedParticipants).reduce(
      (acc, [id, participant]) => ({
        ...acc,
        [id]: {
          ...participant,
          tempAnswer: null,
          hasAnswered: false,
        },
      }),
      {}
    );

    await optimisticUpdate(ongoingQuiz.id ? ongoingQuiz.id : '', {
      ...ongoingQuiz,
      isShowingCorrectAnswer: showAnswer,
      currentSlide: showAnswer
        ? ongoingQuiz.currentSlide
        : ongoingQuiz.currentSlide + 1,
      participants: updatedParticipants,
      currentSlideTime: showAnswer ? ongoingQuiz.currentSlideTime : new Date().toISOString(),
    });
  };

  const getCurrentSlide = (): Slide | null => {
    if (!ongoingQuiz?.quiz.slides) return null;

    const currentSlideIndex = ongoingQuiz.currentSlide - 1;

    if (ongoingQuiz.currentSlide === 0) {
      return {
        id: '',
        type: SlideTypes.lobby,
        title: 'Lobby Slide',
        quizCode: ongoingQuiz.id,
      } as LobbySlide;
    }

    return ongoingQuiz.quiz.slides[currentSlideIndex];
  };

  const changeTurn = async (
    participantId: string,
    quizCode: string
  ): Promise<void> => {
    if (!participantId) {
      console.error('Participant ID is missing.');
      throw new Error('Invalid parameters provided.');
    }

    try {
      console.log(`Updating turn to participant ID: ${participantId}`);

      // Reference the specific quiz path in the database
      const quizRef = ref(database, `ongoingQuizzes/${quizCode}`);

      // Update only the 'isTurn' field
      await update(quizRef, { isTurn: participantId });

      console.log(`Turn successfully updated to participant ${participantId}.`);
    } catch (error) {
      console.error(
        `Error updating turn for participant ${participantId}:`,
        error
      );
      throw error; // Propagate the error for the caller to handle
    }
  };

  const updateSlideUsedAnswers = async (
    slideId: string,
    quizCode: string,
    usedAnswers: string[]
  ): Promise<void> => {
    if (!ongoingQuiz || !ongoingQuiz.quiz?.slides) {
      console.error('Quiz data or slides are missing.');
      throw new Error('Invalid quiz data.');
    }

    console.log('Used answers:', usedAnswers);

    try {
      // Get the slide to update
      const slide = ongoingQuiz.quiz.slides[ongoingQuiz.currentSlide - 1];
      console.log('Slide to be updated:', slide);

      // Update the usedAnswers field
      const updatedSlide = {
        ...slide,
        usedAnswers, // Update the usedAnswers field with the provided list
      };

      // Create a copy of the quiz with the updated slide
      const updatedQuiz = {
        ...ongoingQuiz,
        quiz: {
          ...ongoingQuiz.quiz,
          slides: [
            ...ongoingQuiz.quiz.slides.slice(0, ongoingQuiz.currentSlide - 1),
            updatedSlide,
            ...ongoingQuiz.quiz.slides.slice(ongoingQuiz.currentSlide),
          ],
        },
      };

      // Log the updated quiz to verify the changes before updating the database
      console.log('Updated Quiz:', updatedQuiz);

      console.log('updated slide', updatedSlide);

      // Perform an optimistic update
      const updateResult = await optimisticUpdate(quizCode, updatedQuiz);
      if (!updateResult) {
        console.error('Optimistic update failed.');
        throw new Error('Optimistic update failed.');
      }

      console.log(`UsedAnswers updated for slide ${slideId}.`);
    } catch (error) {
      console.error(`Error updating usedAnswers for slide ${slideId}:`, error);
      throw error;
    }
  };

  useEffect(() => {
    const checkAnswers = async () => {
      const currentSlide = ongoingQuiz?.currentSlide
        ? ongoingQuiz.currentSlide
        : 0;
      if (currentSlide == 0) return;

      const questionSlide = ongoingQuiz?.quiz.slides[
        currentSlide - 1
      ] as QuestionSlide;

      if (
        !ongoingQuiz?.isShowingCorrectAnswer &&
        allAnswered &&
        !(questionSlide.showCorrectAnswer == ShowCorrectAnswerTypes.never)
      ) {
        nextSlide();
      }
    };
    checkAnswers();
  }, [ongoingQuiz, allAnswered]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        event.code === 'Space' ||
        event.code === 'Enter' ||
        event.code === 'ArrowRight'
      ) {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [nextSlide]);

  return {
    ongoingQuiz,
    getCurrentSlide,
    nextSlide,
    handleAddPoints,
    changeTurn,
    updateSlideUsedAnswers,
    endQuiz,
    removeParticipant,
  };
};
