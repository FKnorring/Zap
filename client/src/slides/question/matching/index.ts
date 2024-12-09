export * from './Preview';
export * from './Participant';
export * from './ParticipantAnswer';
export * from './Host';
export * from './HostAnswer';
export * from './CalculateScore';

import { QuestionTypes, SlideTypes, AnswerTypes } from '@/models/Quiz';
import { ListTree } from "lucide-react";
import { SlideInfo } from '../..';

export const Info: SlideInfo = {
    value: "question:MATCHING",
    icon: ListTree,
    label: "Match Items",
    slideType: SlideTypes.question,
    questionType: QuestionTypes.MATCHING,
    defaults: {
        labels: [
            { id: '1', text: "Label 1", correctOptions: ["Option 1"] },
            { id: '2', text: "Label 2", correctOptions: ["Option 2"] }
        ],
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        answerType: AnswerTypes.matching,
        points: 1000,
    }
} as const;
