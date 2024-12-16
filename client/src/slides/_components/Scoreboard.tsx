import { useEffect, useState } from 'react';
import Avatar, { genConfig } from 'react-nice-avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { Participant, Slide, SlideTypes } from '@/models/Quiz';

function setDeceleratingTimeout(
  callback: () => void,
  initialFactor: number,
  finalFactor: number,
  fastSteps: number,
  totalSteps: number
) {
  const internalCallback = (tick: number) => {
    return function () {
      if (tick > 0) {
        const delay =
          tick > totalSteps - fastSteps
            ? initialFactor + Math.random() * 5 // Quick updates with a slight variation
            : initialFactor +
              ((finalFactor - initialFactor) / (totalSteps - fastSteps)) *
                (totalSteps - tick); // Gradual increase in delay

        window.setTimeout(internalCallback(tick - 1), delay);
        callback();
      }
    };
  };

  window.setTimeout(internalCallback(totalSteps), initialFactor);
}

function Counter({
  value,
  shouldAnimate,
  previousValue,
}: {
  value: number;
  shouldAnimate: boolean;
  previousValue: number;
}) {
  const [displayValue, setDisplayValue] = useState(previousValue);

  useEffect(() => {
    if (!shouldAnimate || value === previousValue) return;

    const totalSteps = 100; // Total steps for the animation
    const fastSteps = 80; // Steps with quick updates
    const initialFactor = 10; // Starting delay (ms)
    const finalFactor = 30; // Maximum delay for the last steps (ms)
    const totalChange = value - previousValue;
    const stepValue = totalChange / totalSteps;

    let currentStep = 0;

    setDeceleratingTimeout(
      () => {
        setDisplayValue(() => {
          currentStep += 1;
          return Math.round(previousValue + currentStep * stepValue);
        });
      },
      initialFactor,
      finalFactor,
      fastSteps,
      totalSteps
    );

    return () => {
      // No cleanup necessary as timeouts naturally resolve
    };
  }, [value, previousValue, shouldAnimate]);

  return <span>{displayValue}</span>;
}

// Scoreboard component to render and calculate the scores
interface ScoreBoardProps {
  participants: Participant[];
  slides: Slide[];
  currentSlide: number;
}

function ScoreBoard({ participants, slides, currentSlide }: ScoreBoardProps) {
  const [processedParticipants, setProcessedParticipants] = useState<
    Array<{
      name: string;
      avatar: string;
      totalScore: number;
      lastScoreScore: number;
    }>
  >([]);
  const [previousParticipants, setPreviousParticipants] = useState<
    Array<{
      name: string;
      avatar: string;
      totalScore: number;
      lastScoreScore: number;
    }>
  >([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const calculateScores = (
    participants: Participant[],
    slides: Slide[],
    currentSlideIndex: number
  ) => {
    const questionIndexes = slides
      .map((slide, index) =>
        slide.type === SlideTypes.question ? index : null
      )
      .filter((index): index is number => index !== null);

    const scoreIndexes = slides
      .map((slide, index) => (slide.type === SlideTypes.score ? index : null))
      .filter((index): index is number => index !== null);

    return participants.map((participant) => {
      const adjustedScores =
        participant.score.length > 1
          ? participant.score.slice(1)
          : participant.score;
      const totalScore = adjustedScores.reduce((sum, score) => sum + score, 0);

      const secondLastScoreIndex = scoreIndexes
        .filter((index) => index < currentSlideIndex)
        .slice(-2, -1)[0];

      const lastScoreScore =
        secondLastScoreIndex !== undefined
          ? adjustedScores
              .slice(
                0,
                questionIndexes.filter((index) => index < secondLastScoreIndex)
                  .length
              )
              .reduce((sum, score) => sum + score, 0)
          : 0;

      return {
        ...participant,
        totalScore,
        lastScoreScore,
      };
    });
  };

  useEffect(() => {
    if (!slides) return;

    // Calculate scores for current participants
    const updatedParticipants = calculateScores(
      participants,
      slides,
      currentSlide
    );

    // Sort participants based on total score (updated scores)
    updatedParticipants.sort((a, b) => b.totalScore - a.totalScore);

    if (!isAnimating) {
      // Sort based on last scoreboard scores for initial render
      const initialParticipants = [...updatedParticipants].sort(
        (a, b) => b.lastScoreScore - a.lastScoreScore
      );

      setPreviousParticipants(initialParticipants); // Initial order based on last scores
      setTimeout(() => {
        setIsAnimating(true);
        setProcessedParticipants(updatedParticipants); // Update to new order
      }, 1500);
    } else {
      setProcessedParticipants(updatedParticipants); // Animate new order
    }
  }, [participants, slides, currentSlide, isAnimating]);

  return (
    <div className="flex-1 w-full flex-col items-center justify-center overflow-hidden p-4">
      <div className="flex w-full flex-col items-center justify-center overflow-hidden p-4">
        <AnimatePresence>
          {(isAnimating ? processedParticipants : previousParticipants).map(
            (participant, index) => (
              <motion.div
                key={participant.name}
                layoutId={participant.name} // Ensure unique IDs for animation
                initial={isAnimating ? false : { opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-4 m-3 w-full max-w-md justify-start"
              >
                <span className="w-[20px] font-display text-component-background text-6xl mr-2">
                  {index + 1}
                </span>
                <Avatar
                  style={{ width: '4rem', height: '4rem' }}
                  {...genConfig(participant.avatar)}
                />
                <div className="bg-component-background flex items-center justify-between font-display p-4 rounded-lg w-full flex-grow min-w-0">
                  <span className="text-textonwbg-grayonw text-3xl truncate">
                    {participant.name}
                  </span>
                  <span className="text-textonwbg-grayonw text-3xl">
                    <Counter
                      value={participant.totalScore}
                      previousValue={participant.lastScoreScore}
                      shouldAnimate={isAnimating}
                    />
                  </span>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ScoreBoard;
