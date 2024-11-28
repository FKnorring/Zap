export * from './Preview';
export * from './Participant';
export * from './ParticipantAnswer';
export * from './Host';
export * from './HostAnswer';

import { QuestionTypes, SlideTypes, AnswerTypes } from '@/models/Quiz';
import { ListOrdered } from "lucide-react";
import { SlideInfo } from '../..';

export const Info: SlideInfo = {
    value: "question:RANK",
    icon: ListOrdered,
    label: "Rank Answers",
    slideType: SlideTypes.question,
    questionType: QuestionTypes.RANK,
    defaults: {
        ranking: [],
        answerType: AnswerTypes.rank,
    }
} as const; 