import { Button } from "../ui/button";
import { MCQSASlide } from "@/models/Quiz";

interface Options {
  id: string;
  text: string;
  isCorrect: boolean;
}
interface McqsaViewProps {
  question: MCQSASlide;
  answerQuestion: (answer: string) => void;
}

export default function McqsaView({
  question,
  answerQuestion,
}: McqsaViewProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full pt-80">
      <h1 className="text-3xl font-display text-center">{question.title}</h1>
      {question.options.map((option: Options) => (
        <Button key={option.text} onClick={() => answerQuestion(option.text)}>
          {option.text}
        </Button>
      ))}
    </div>
  );
}
