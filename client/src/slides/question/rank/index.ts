export * from './Preview';
export * from './Participant';
export * from './ParticipantAnswer';
export * from './Host';
export * from './HostAnswer';
export * from './CalculateScore';

import { QuestionTypes, SlideTypes, AnswerTypes } from '@/models/Quiz';
import {FaListOl} from 'react-icons/fa';
import { SlideInfo } from '../..';

export const Info: SlideInfo = {
  value: 'question:RANK',
  icon: FaListOl,
  iconColor:"#14b8a6",
  label: QuestionTypes.RANK,
  interactivePreview: true,
  slideType: SlideTypes.question,
  questionType: QuestionTypes.RANK,
  defaults: {
    ranking: ['First', 'Second', 'Third', 'Last'],
    answerType: AnswerTypes.rank,
    points: 1000,
  },
} as const;
