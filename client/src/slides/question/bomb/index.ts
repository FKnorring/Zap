export * from './Preview';
export * from './Participant';
export * from './ParticipantAnswer';
export * from './Host';
export * from './HostAnswer';
export * from './CalculateScore';

import { BombSlide, QuestionTypes, SlideTypes } from '@/models/Quiz';
import { SlideInfo } from '../..';
import { Bomb } from 'lucide-react';

// Fix the Info definition and the defaults property
export const Info: SlideInfo = {
  value: 'question:BOMB',
  icon: Bomb,
  label: 'Ticking time bomb',
  slideType: SlideTypes.question,
  questionType: QuestionTypes.BOMB,
  interactivePreview: true,
  defaults: { points: 1000, initialTime: 30, hearts: 3 } as Partial<BombSlide>, // Default to an empty object or provide appropriate defaults
} as const;
