export * from './Preview';
export * from './ParticipantAnswer';
export * from './Participant';
export * from './Host';
export * from './HostAnswer';
export * from './CalculateAnswer';

import { QuestionTypes, SlideTypes, AnswerTypes } from '@/models/Quiz';
import { Target } from 'lucide-react';
import { SlideInfo } from '../..';

export const Info: SlideInfo = {
  value: 'question:CLOSEST',
  icon: Target,
  label: QuestionTypes.CLOSEST,
  slideType: SlideTypes.question,
  questionType: QuestionTypes.CLOSEST,
  defaults: {
    answerType: AnswerTypes.number,
    points: 1000,
    correctAnswer: 0,
  },
} as const; 