import { SlideTypes } from '@/models/Quiz';
import { ListChecks } from "lucide-react";
import { SlideInfo } from "..";

export * from './Preview';
export * from './Participant';
export * from './ParticipantAnswer';
export * from './Render';
export * from './Host';
export * from './HostAnswer';

export const Info: SlideInfo = {
    value: "bulletPoint",
    icon: ListChecks,
    iconColor:"#92400e",
    label: "Bullet Points",
    interactivePreview: true,
    slideType: SlideTypes.bulletPoint,
    defaults: {
        points: [],
        imagePosition: 'right',
        fontSize: 48,
        pointSpacing: 12
    }
} as const; 