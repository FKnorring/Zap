import { useState, useEffect } from 'react';
import { BombSlide } from '@/models/Quiz';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Participant } from '@/models/Quiz';
import { useTranslation } from 'react-i18next';

interface BombParticipantProps {
  slide: BombSlide;
  answerQuestion: (answer: string[]) => void;
  answerTempQuestion: (answer: string) => boolean;
  participantData: Participant;
  turn: string;
}

export function Participant({
  slide,
  answerTempQuestion,
  participantData,
  turn,
}: BombParticipantProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [counter, setCounter] = useState(slide.initialTime || 0);
  const [shake, setShake] = useState(false);
  const [disableInput, setDisableInput] = useState(false);
  const { t } = useTranslation();

  // Handle the input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value);
  };

  const handleCheckAnswer = () => {
    console.log('Checking answer...');
    const isValid = answerTempQuestion(userAnswer);

    if (isValid) {
      setUserAnswer('');
      // Keep the timer running, and rely on `turn` change to reset or stop input
    } else {
      console.log('Wrong answer');
    }
  };

  // Manage the countdown timer and shaking animation
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    // Reset the counter and shake when the turn changes
    if (turn !== participantData.participantId) {
      setCounter(slide.initialTime || 0); // Reset counter
      setShake(false); // Remove shake effect
      setDisableInput(true); // Disable input
    } else {
      setDisableInput(false); // Enable input for the current participant
      interval = setInterval(() => {
        setCounter((prevCounter) => {
          if (prevCounter <= 1) {
            clearInterval(interval); // Stop the countdown at zero
            setShake(true); // Trigger the shake animation
            return 0;
          }
          return prevCounter - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [turn, participantData.participantId, slide.initialTime]);

  return (
    <div
      className={`flex flex-col h-full p-10 ${shake ? 'animate-shake' : ''}`}
    >
      <h1 className="text-6xl font-display font-bold text-center mb-12">
        {slide.title}
      </h1>
      <div className="flex flex-col items-center justify-center w-full">
        <div
          className={`p-8 rounded-md shadow-lg text-black font-display text-3xl mb-8 w-3/4 max-w-lg ${turn === participantData.participantId ? 'bg-white' : 'bg-gray-300'}`}
        >
          <Input
            value={userAnswer}
            onChange={handleInputChange}
            placeholder={t('participants:enterAnswer')}
            className="mb-6 w-full p-4 text-xl border border-gray-300 rounded-md"
            autoCorrect="off"
            disabled={disableInput}
          />
          <Button
            onClick={handleCheckAnswer}
            className="w-full p-4 text-xl font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
            disabled={disableInput}
          >
            {t('participants:send')}
          </Button>
          {disableInput && (
            <p className="mt-4 text-center text-xl font-medium text-gray-600">
              {t('participants:waitYourTurn')}
            </p>
          )}
        </div>
        {turn === participantData.participantId && counter > 0 && (
          <div className="mt-4 text-center">
            <p
              className={`text-6xl font-bold ${counter <= 5 ? 'text-red-600' : 'text-white'}`}
            >
              {counter}s
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
