export * from './Preview';
export * from './Participant';
export * from './ParticipantAnswer';
export * from './Host';
export * from './HostAnswer';
export * from './CalculateScore';

import { BombSlide, QuestionTypes, SlideTypes } from '@/models/Quiz';
import { SlideInfo } from '../..';
import {FaBomb} from 'react-icons/fa';

// Fix the Info definition and the defaults property
export const Info: SlideInfo = {
  value: 'question:BOMB',
  icon: FaBomb,
  iconColor:"#111827",
  label: 'Ticking time bomb',
  slideType: SlideTypes.question,
  slideState: "Waiting",
  questionType: QuestionTypes.BOMB,
  interactivePreview: true,
  defaults: { points: 1000, initialTime: 30, hearts: 3 } as Partial<BombSlide>, // Default to an empty object or provide appropriate defaults
} as const;
