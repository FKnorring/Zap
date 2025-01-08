export * from './Preview';
export * from './ParticipantAnswer';
export * from './Participant';
export * from './Host';
export * from './HostAnswer';
export * from './CalculateAnswer';

import { QuestionTypes, SlideTypes, AnswerTypes } from '@/models/Quiz';
import { FaCrosshairs } from 'react-icons/fa';
import { SlideInfo } from '../..';

export const Info: SlideInfo = {
  value: 'question:CLOSEST',
  icon: FaCrosshairs,
  label: QuestionTypes.CLOSEST,
  slideType: SlideTypes.question,
  questionType: QuestionTypes.CLOSEST,
  defaults: {
    answerType: AnswerTypes.number,
    points: 1000,
    correctAnswer: 0,
  },
} as const; 