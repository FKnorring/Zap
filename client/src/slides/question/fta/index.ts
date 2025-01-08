export * from "./Preview";
export * from "./ParticipantAnswer";
export * from "./Participant";
export * from "./Host";
export * from './HostAnswer';
export * from './CalculateAnswer';

import { QuestionTypes, SlideTypes, AnswerTypes } from "@/models/Quiz";
import { FaComment } from "react-icons/fa";
import { SlideInfo } from "../..";
export const Info: SlideInfo = {
  value: 'question:FTA',
  icon: FaComment,
  label: QuestionTypes.FTA,
  slideType: SlideTypes.question,
  questionType: QuestionTypes.FTA,
  defaults: {
    correctAnswer: '',
    answerType: AnswerTypes.freeText,
    points: 1000,
  },
} as const;
