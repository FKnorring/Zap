import { JeopardySlide, Participant } from "@/models/Quiz";

interface Props {
  slide: JeopardySlide;
  participants: Participant[];
  currentSlideTime?: string;
}

export function CalculateScore({ participants }: Props) {
  return participants.map((participant) =>{
    console.log(participant.name)
    const latestAnswer = participant.answers.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).at(-1)?.answer[0];
    console.log(participant.answers);
    if (!latestAnswer) return 0;
    return parseInt(latestAnswer);
  });
} 