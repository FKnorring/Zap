export * from './Preview';
export * from './Participant';
export * from './ParticipantAnswer'
export * from './Render';
export * from './Host';
export * from './HostAnswer'

import { SlideTypes } from '@/models/Quiz';
import { InfoIcon } from "lucide-react";
import { SlideInfo } from "..";

export const Info: SlideInfo = {
    value: "info",
    icon: InfoIcon,
    iconColor:"#64748b",
    label: "Information Slide",
    slideType: SlideTypes.info,
    defaults: {}
} as const;