import { useState } from "react";
import { Button } from "../ui/button";
import { MCQMASlide } from "@/models/Quiz";

interface Options {
  id: string;
  text: string;
  isCorrect: boolean;
}
interface McqmaViewProps {
  question: MCQMASlide;
  answerQuestion: (answer: string) => void;
}

export default function McqmaView({
  question,
  answerQuestion,
}: McqmaViewProps) {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  const toggleOption = (index: number) => {
    setSelectedIndexes(
      (prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index) // Remove if already selected
          : [...prev, index], // Add if not selected
    );
  };

  const handleSubmit = () => {
    answerQuestion(JSON.stringify(selectedIndexes)); // Send indexes as a string
  };

  return (
    <div className="flex flex-col items-center justify-center h-full pt-80">
      <h1 className="text-3xl font-display text-center">{question.title}</h1>
      <div className="flex flex-col space-y-4">
        {question.options.map((option: Options, index: number) => (
          <Button
            key={option.text}
            onClick={() => toggleOption(index)}
            className={
              selectedIndexes.includes(index) ? "bg-blue-500" : "bg-gray-200"
            }
          >
            {option.text}
          </Button>
        ))}
      </div>
      <Button
        onClick={handleSubmit}
        disabled={selectedIndexes.length === 0}
        className="mt-6"
      >
        Submit Answer
      </Button>
    </div>
  );
}
