import { useState } from 'react';
import Countdown from 'react-countdown';
import { MCQSASlide } from '@/models/Quiz';
import { getColor } from '../base/QuizColors';
import { Button } from '@/components/ui/button';
import { global_values } from '@/config/values';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface Options {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface McqsaViewProps {
  slide: MCQSASlide;
  answerQuestion: (answer: string[]) => void;
  currentSlideTime: string;
}

export function Participant({
  slide,
  answerQuestion,
  currentSlideTime,
}: McqsaViewProps) {
  const { t } = useTranslation(['participants']);
  const showQuestionTime =
    new Date(currentSlideTime).getTime() + global_values.waiting_time;

  const [isTimeToShow, setIsTimeToShow] = useState(
    Date.now() >= showQuestionTime
  );

  // Countdown UI
  if (!isTimeToShow) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10">
        <h1 className="text-4xl font-display font-bold text-center mb-8">
          {t('questionWillStart')}
        </h1>
        <Countdown
          date={showQuestionTime}
          onComplete={() => setIsTimeToShow(true)}
          renderer={({ completed, total }) => {
            if (completed) {
              return <span className="text-red-500 font-bold">Time's up!</span>;
            } else {
              // Calculate total seconds remaining
              const totalSeconds = Math.ceil(total / 1000);
              const displaySeconds = totalSeconds % 60;
              return (
                <div
                  style={{
                    width: '90px',
                    height: '90px',
                    position: 'relative',
                    bottom: '4',
                    left: '4',
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
                  ></motion.div>
                  <span className="text-4xl font-display absolute inset-0 flex items-center justify-center">
                    {displaySeconds}
                  </span>
                </div>
              );
            }
          }}
        />
      </div>
    );
  }

  // Question UI
  return (
    <div className="flex flex-col items-center justify-center h-full p-10">
      <h1 className="lg:text-5xl text-4xl font-display font-bold text-center mb-8">
        {slide.title}
      </h1>
      <div className="grid grid-cols-2 gap-6 w-full max-w-3xl">
        {slide.options.map((option: Options, index: number) => (
          <Button
            key={option.id}
            onClick={() => answerQuestion([option.text])}
            isInteractive
            inGrid
            style={{
              backgroundColor: getColor(index),
              cursor: 'pointer',
            }}
            className="flex items-center justify-center text-2xl text-white font-display h-32 rounded-lg hover:ring-4 hover:ring-white"
          >
            {option.text}
          </Button>
        ))}
      </div>
    </div>
  );
}
