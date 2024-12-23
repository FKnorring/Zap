import { useState } from 'react';
import { MCQMASlide } from '@/models/Quiz';
import { getColor } from '@/slides/question/base/QuizColors';
import { Button } from '@/components/ui/button';

interface Options {
  id: string;
  text: string;
  isCorrect: boolean;
}
interface McqmaViewProps {
  slide: MCQMASlide;
  answerQuestion: (answer: string[]) => void;
}

export function Participant({ slide, answerQuestion }: McqmaViewProps) {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  const toggleOption = (index: number) => {
    setSelectedIndexes(
      (prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index) // Remove if already selected
          : [...prev, index] // Add if not selected
    );
  };

  const handleSubmit = () => {
    const selectedAnswers = selectedIndexes.map(
      (index) => slide.options[index].text
    );
    answerQuestion(selectedAnswers);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-10 select-none">
      <h1 className=" text-3xl lg:text-5xl font-display font-bold text-center justify-center mb-8">
        {slide.title}
      </h1>
      <div className="grid grid-cols-2 gap-6 w-full">
        {slide.options.map((option: Options, index: number) => {
          const isShortText = option.text.length < 10;

          return (
            <Button
              key={option.id}
              onClick={() => toggleOption(index)}
              style={{
                backgroundColor: getColor(index),
              }}
              className={`flex items-center justify-center text-white font-display h-32 w-full rounded-lg ${
                selectedIndexes.includes(index) ? 'ring-4 ring-white' : ''
              }`}
            >
              <span
                className="overflow-hidden whitespace-normal break-words text-center px-2"
                style={{
                  fontSize: isShortText ? '1.5rem' : '1rem', // Bigger font for shorter text
                  display: '-webkit-box',
                  WebkitLineClamp: 2, // Limits to 2 lines
                  WebkitBoxOrient: 'vertical',
                  wordBreak: 'break-word', // Handle long unbreakable words
                  hyphens: 'auto', // Add hyphenation if supported
                }}
              >
                {option.text}
              </span>
            </Button>
          );
        })}
      </div>
      <button
        onClick={handleSubmit}
        disabled={selectedIndexes.length === 0}
        className="mt-8 py-4 px-6 text-2xl font-bold text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50"
      >
        Submit Answer
      </button>
    </div>
  );
}
