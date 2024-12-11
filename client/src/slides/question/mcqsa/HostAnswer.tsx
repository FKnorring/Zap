import { MCQSASlide, Participant } from "@/models/Quiz";
import { CheckCircle2, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";
import { getColor } from "../base/QuizColors";
import NextSlide from "@/slides/_components/NextSlide";

export function HostAnswer({
  slide,
  participants = [],
  isPreview = false, // Default to false
  onNextSlide,
}: {
  slide: MCQSASlide;
  participants: Participant[];
  isPreview?: boolean;
  onNextSlide: () => void;
}) {
  console.log(participants);

  const AnswerCount = () => {
    const calculateAnswerCounts = () => {
      return slide.options.map((option) => {
        // Calculate count: either randomized or based on participant answers
        return isPreview
          ? Math.floor(Math.random() * 7) // Random count between 0 and 6
          : participants.filter((participant) => {
              // Get the latest answer
              const latestAnswer =
                participant.answers.length > 0
                  ? participant.answers[participant.answers.length - 1]
                  : null;

              // Check if the latestAnswer contains the current option.id
              return latestAnswer?.answer.some((ans) => ans === option.text);
            }).length;
      });
    };

    const answerCounts = calculateAnswerCounts();
    const maxVotes = Math.max(...answerCounts);

    return (
      <div className="items-end justify-center flex gap-10 w-full pb-20">
        {slide.options.map((option, index) => {
          const height =
            maxVotes > 0 ? (answerCounts[index] / maxVotes) * 200 : 0;

          return (
            <div
              key={option.id}
              className="max-w-[200px] min-h-fit w-full flex flex-col justify-end text-center p-3 rounded-lg text-white"
              style={{
                backgroundColor: getColor(index),
                opacity: option.isCorrect ? 1 : 0.6,
                height: `${height}px`, // Set height based on votes
              }}
            >
              <div className="flex flex-row justify-center">
                <h1 className="text-2xl font-display">
                  {answerCounts[index]} votes
                </h1>
                {option.isCorrect ? (
                  <CheckCircle2 className="w-8 h-8 text-white ml-4" />
                ) : (
                  <CircleX className="w-8 h-8 text-white ml-4" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const CorrectAnswers = () => {
    return (
      <div
        className={cn(
          "grid gap-6 w-full",
          `grid-cols-${Math.ceil(slide.options.length / 2)}`
        )}
        style={{ gridAutoRows: "1fr" }}
      >
        {slide.options.map((option, index) => (
          <div
            key={option.id}
            className={cn(
              "flex items-center justify-between text-3xl text-white font-display h-40 p-6 gap-4 rounded-lg box-border w-full",
              {
                "bg-white/10 backdrop-blur outline outline-white/50":
                  !option.isCorrect,
                "ring-4 ring-white": option.isCorrect,
              }
            )}
            style={{
              backgroundColor: getColor(index),
              opacity: option.isCorrect ? 1 : 0.6,
            }}
          >
            <span className="text-center">{option.text}</span>
            {option.isCorrect ? (
              <CheckCircle2 className="w-12 h-12 text-white ml-4" />
            ) : (
              <CircleX className="w-12 h-12 text-white ml-4" />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center h-full p-10 w-full">
      <div className="bg-white rounded p-6 mb-40">
        <h1 className="text-4xl text-black font-display">{slide.title}</h1>
      </div>
      <AnswerCount />
      <CorrectAnswers />
      <NextSlide onClick={onNextSlide} />
    </div>
  );
}
