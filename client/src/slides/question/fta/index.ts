export * from "./Preview";
export * from "./ParticipantAnswer";
export * from "./Participant";
export * from "./Host";
export * from './HostAnswer';
export * from './CalculateAnswer';

import { QuestionTypes, SlideTypes, AnswerTypes } from "@/models/Quiz";
import { TypeIcon } from "lucide-react";
import { SlideInfo } from "../..";
export const Info: SlideInfo = {
  value: 'question:FTA',
  icon: TypeIcon,
  label: QuestionTypes.FTA,
  slideType: SlideTypes.question,
  questionType: QuestionTypes.FTA,
  defaults: {
    correctAnswer: '',
    answerType: AnswerTypes.freeText,
    points: 1000,
  },
} as const;
