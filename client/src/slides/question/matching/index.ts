export * from './Preview';
export * from './Participant';
export * from './ParticipantAnswer';
export * from './Host';
export * from './HostAnswer';
export * from './CalculateScore';

import { QuestionTypes, SlideTypes, AnswerTypes } from '@/models/Quiz';
import { ListTree } from 'lucide-react';
import { SlideInfo } from '../..';

export const Info: SlideInfo = {
  value: 'question:MATCHING',
  icon: ListTree,
  label: QuestionTypes.MATCHING,
  slideType: SlideTypes.question,
  questionType: QuestionTypes.MATCHING,
  defaults: {
    labels: [
      { id: '1', text: 'Pizzas', correctOptions: ['Margherita', 'Pepperoni'] },
      { id: '2', text: 'Pastas', correctOptions: ['Spaghetti', 'Lasagna'] },
    ],
    options: ['Margherita', 'Pepperoni', 'Spaghetti', 'Lasagna', 'Risotto'],
    answerType: AnswerTypes.matching,
    points: 1000,
  },
} as const;
