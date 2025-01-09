export * from './Preview';
export * from './ParticipantAnswer';
export * from './Participant';
export * from './Host';
export * from './HostAnswer';
export * from './CalculateAnswer';
import { QuestionTypes, SlideTypes, AnswerTypes } from '@/models/Quiz';
import {FaTachometerAlt} from 'react-icons/fa';
import { SlideInfo } from '../..';


export const Info: SlideInfo = {
  value: 'question:FA',
  icon: FaTachometerAlt,
  iconColor:"#e879f9",
  label: QuestionTypes.FA,
  slideType: SlideTypes.question,
  questionType: QuestionTypes.FA,
  defaults: {
    answerType: AnswerTypes.time,
    points: 1000,
    correctAnswer: '',
  },
} as const;
