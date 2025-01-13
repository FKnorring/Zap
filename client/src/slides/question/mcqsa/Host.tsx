import { useState } from 'react';
import Countdown from 'react-countdown';
import { motion } from 'framer-motion';
import { MCQSASlide } from '@/models/Quiz';
import { BaseQuestionRender } from '../base/QuestionRender';
import NextSlide from '@/slides/_components/NextSlide';
import { global_values } from '@/config/values'; // Make sure you have waiting_time in here
import RenderOptions from '../base/RenderOptions';

export function Host({
  slide,
  onNextSlide,
  onPrevSlide,
  currentSlideTime,
  endQuiz,
  quizCode,
  inPreview = false,
}: {
  slide: MCQSASlide;
  onNextSlide: () => void;
  onPrevSlide: () => void;
  currentSlideTime: string;
  endQuiz: (quizCode: string) => Promise<boolean>;
  quizCode: string;
  inPreview?: boolean;
}) {
  const showQuestionTime =
    Number(currentSlideTime) + global_values.waiting_time;

  const [isTimeToShow, setIsTimeToShow] = useState(
    new Date().getTime() >= showQuestionTime
  );

  if (currentSlideTime !== null && typeof currentSlideTime === 'object') {
    return null;
  }
  // Countdown UI
  if (!isTimeToShow && !inPreview) {
    return (
      <BaseQuestionRender slide={slide}>
        <div className="flex flex-col items-center justify-center h-full p-10">
          <Countdown
            date={showQuestionTime}
            onComplete={() => setIsTimeToShow(true)}
            renderer={({ completed, total }) => {
              if (completed) {
                return (
                  <span className="text-red-500 font-bold">Time's up!</span>
                );
              } else {
                const totalSeconds = Math.ceil(total / 1000);
                const displaySeconds = totalSeconds % 60;

                return (
                  <div
                    style={{
                      width: '90px',
                      height: '90px',
                      position: 'relative',
                    }}
                  >
                    <motion.div
                      key={totalSeconds} // Triggers re-animation each second
                      animate={{ rotate: 90 }}
                      transition={{ duration: 1, ease: 'backIn' }}
                      style={{
                        width: '90px',
                        height: '90px',
                        backgroundColor: '#45b6fe',
                        borderColor: '#F4F3F2',
                        borderWidth: '3px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                      }}
                    />
                    <span className="text-4xl font-display absolute inset-0 flex items-center justify-center">
                      {displaySeconds}
                    </span>
                  </div>
                );
              }
            }}
          />
        </div>
      </BaseQuestionRender>
    );
  }

  // Question UI
  return (
    <BaseQuestionRender slide={slide}>
      <div className="flex flex-col items-center justify-center p-10">
        <RenderOptions slide={slide} />
        <NextSlide
          quizCode={quizCode}
          endQuiz={() => endQuiz(quizCode)} // Corrected here
          onPrev={onPrevSlide}
          onNext={onNextSlide}
        />
      </div>
    </BaseQuestionRender>
  );
}
