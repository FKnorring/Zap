export * from './Preview';
export * from './Participant';
export * from './ParticipantAnswer'
export * from './Host';
export * from './HostAnswer';

import { SlideTypes } from '@/models/Quiz';
import { BarChart3Icon } from "lucide-react";
import { SlideInfo } from '..';


export const Info: SlideInfo = {
    value: "score",
    icon: BarChart3Icon,
    label: "Score Slide",
    slideType: SlideTypes.score,
    defaults: {
        title: "Current Standings",
    }
} as const;
