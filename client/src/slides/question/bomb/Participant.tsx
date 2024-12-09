import { useState } from 'react';
import { BombSlide } from '@/models/Quiz';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface BombParticipantProps {
  slide: BombSlide;
  answerQuestion: (answer: string[]) => void;
  answerTempQuestion: (answer: string) => boolean;
  isTurn?: boolean;
}

export function Participant({
  slide,
  answerTempQuestion,
  isTurn
}: BombParticipantProps) {
  const [userAnswer, setUserAnswer] = useState('');

  // Handle the input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value);
  };

  // Handle answer checking (call answerTempQuestion function)
  const handleCheckAnswer = () => {
    // Call answerTempQuestion to validate the answer
    const isValid = answerTempQuestion(userAnswer);

    if (isValid) {
      setUserAnswer('');
      return isValid;
    } else {
      console.log('wrong answer');
    }
    return isValid;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-10">
      <h1 className="text-5xl font-display font-bold text-center mb-8">
        {slide.title}
      </h1>
      {isTurn && (
        <div className="bg-white p-2 px-4 rounded-md text-black font-display text-2xl mb-8">
          <Input
            value={userAnswer}
            onChange={handleInputChange}
            placeholder="Enter your answer"
          />
        </div>
      )}
      <Button onClick={handleCheckAnswer}>Check Answer</Button>
    </div>
  );
}
