import { useState, useEffect } from 'react';
import { Participant, MatchingSlide } from '@/models/Quiz';
import RenderCorrectIncorrect from '../base/RenderCorrectIncorrect';
import { getColor } from '../base/QuizColors';
import { ArrowRight, Check, X, ArrowLeft } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { motion } from 'framer-motion';

export function ParticipantAnswer({
  slide,
  participant,
}: {
  slide: MatchingSlide;
  participant: Participant;
}) {
  const latestAnswer = participant.answers?.at(-1);
  if (!latestAnswer) return null;

  const answer = latestAnswer.answer as unknown as Record<string, string[]>;

  // State to track if the box should wiggle
  const [wiggle, setWiggle] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (shakeCount < 6) {
        setWiggle((prev) => !prev);
        setShakeCount((prev) => prev + 1);
      }
    }, 6); // Shake every 10 seconds

    return () => clearInterval(interval);
  }, [shakeCount]);

  return (
    <RenderCorrectIncorrect participant={participant}>
      <div className="w-full lg:w-1/5 ">
        <div>
          <div className="carousel-container w-full items-center justify-center overflow-hidden relative">
            {/* Carousel Content */}
            <div className=" justify-center flex flex-row items-center gap-2">
              <ArrowLeft></ArrowLeft>
              <h1 className="text-center text-4xl">Scroll!</h1>
              <ArrowRight></ArrowRight>
            </div>
            <Carousel
              buttons={false}
              increment={1} // Increment by 1
            >
              <CarouselContent>
                {/* Answer items */}
                {slide.labels.map((label, idx) => {
                  const participantAnswers = answer[label.id] || [];
                  const correctAnswers = label.correctOptions || [];
                  const isCorrect = participantAnswers.map((ans: string) =>
                    correctAnswers.includes(ans)
                  );
                  const bg = getColor(idx);

                  return (
                    <CarouselItem key={label.id}>
                      <motion.div
                        className="flex-shrink-0 w-full p-4 rounded-lg flex flex-col items-center gap-2"
                        animate={{
                          x: wiggle ? [0, 10, -10, 5, -5, 0] : 0, // Define the wiggle effect here
                        }}
                        transition={{
                          duration: 0.5,
                          ease: 'easeInOut',
                        }}
                      >
                        <div
                          style={{ backgroundColor: bg }}
                          className="w-full p-4 rounded-lg flex flex-col items-center justify-center gap-2"
                        >
                          <h3 className="text-2xl font-bold font-display">
                            {label.text}
                          </h3>
                          <ul className="flex flex-col gap-2">
                            {participantAnswers.map(
                              (answer: string, idx: number) => (
                                <li
                                  className="bg-card text-black p-1 px-2 rounded flex justify-between items-center"
                                  key={answer}
                                >
                                  {answer}
                                  <span className="ml-1">
                                    {isCorrect[idx] ? (
                                      <Check className="w-4 h-4 text-green-500" />
                                    ) : (
                                      <X className="w-4 h-4 text-red-500" />
                                    )}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </motion.div>
                    </CarouselItem>
                  );
                })}

                {/* Unassigned answers */}
                <CarouselItem>
                  <motion.div
                    className="flex-shrink-0 w-full p-4 rounded-lg flex flex-col items-center gap-2"
                    animate={{
                      x: wiggle ? [0, 10, -10, 5, -5, 0] : 0, // Define the wiggle effect for unassigned answers
                    }}
                    transition={{
                      duration: 0.5,
                      ease: 'easeInOut',
                    }}
                  >
                    <div className="w-full p-4 rounded-lg flex flex-col items-center justify-center gap-2 bg-secondary/50">
                      <h3 className="text-2xl font-bold font-display">
                        Unassigned
                      </h3>
                      <ul className="flex flex-col gap-2">
                        {(answer.unassigned || []).map((unassigned: string) => {
                          const shouldBeAssigned = slide.labels.some((label) =>
                            label.correctOptions.includes(unassigned)
                          );
                          return (
                            <li
                              className="bg-card text-black p-1 px-2 rounded flex justify-between items-center"
                              key={unassigned}
                            >
                              {unassigned}
                              <span className="ml-1">
                                {!shouldBeAssigned ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <X className="w-4 h-4 text-red-500" />
                                )}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </motion.div>
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </RenderCorrectIncorrect>
  );
}
