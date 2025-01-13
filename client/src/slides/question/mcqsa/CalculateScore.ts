import { MCQSASlide } from "@/models/Quiz";
import { CalculateScoreProps } from "@/slides";
import { global_values } from "@/config/values";

export function CalculateScore({
  slide,
  participants,
  currentSlideTime,
}: CalculateScoreProps<MCQSASlide>) {
  const { options } = slide;

  // If they choose to award points for correct answers or if they choose TIME but no timelimit was set
  if(slide.pointsAwarding === 'CORRECT' || slide.timeLimit === 0) {
    return participants.map((participant) => {
      const latestAnswer = participant.answers?.at(-1)?.answer;
      if (!latestAnswer) return 0;
      return options.find((option) => option.isCorrect)?.text === latestAnswer[0] ? slide.points : 0;
    });
  }

  if(!currentSlideTime) return participants.map(() => 0);

  return participants.map((participant) => {
    const latestAnswer = participant.answers?.at(-1)
    if (!latestAnswer) return 0;
    const wasCorrect = options.find((option) => option.isCorrect)?.text === latestAnswer.answer[0];
    if (!wasCorrect) return 0;
    const questionAsked = new Date(currentSlideTime)
    const questionAskedDelay = questionAsked.getTime() + global_values.waiting_time
    const questionAnswered = new Date(latestAnswer.time)
    const timeTaken =  (questionAnswered.getTime()-questionAskedDelay) / 1000
    console.log(timeTaken)

    return Math.floor(( 1 - (( timeTaken / slide.timeLimit ) / 2 )) * slide.points);
  });
}
