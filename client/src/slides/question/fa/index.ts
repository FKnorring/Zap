export * from "./Preview";
export * from "./ParticipantAnswer";
export * from "./Participant";
export * from "./Host";
export * from "./HostAnswer";
export * from "./CalculateAnswer";
import { QuestionTypes, SlideTypes, AnswerTypes } from "@/models/Quiz";
import { Timer } from "lucide-react";
import { SlideInfo } from "../..";

export const Info: SlideInfo = {
  value: "question:FA",
  icon: Timer,
  label: "Fastest Finger First",
  slideType: SlideTypes.question,
  questionType: QuestionTypes.FA,
  defaults: {
    answerType: AnswerTypes.time,
    points: 1000,
    correctAnswer: "",
  },
} as const;
