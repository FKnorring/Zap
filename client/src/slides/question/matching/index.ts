export * from './Preview';
export * from './Participant';
export * from './ParticipantAnswer';
export * from './Host';
export * from './HostAnswer';
export * from './CalculateScore';

import { QuestionTypes, SlideTypes, AnswerTypes } from '@/models/Quiz';
import { FaPuzzlePiece } from 'react-icons/fa';
import { SlideInfo } from '../..';

export const Info: SlideInfo = {
  value: 'question:MATCHING',
  icon: FaPuzzlePiece,
  iconColor:"#8b5cf6",
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
