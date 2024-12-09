export * from "./Preview";
export * from "./ParticipantAnswer";
export * from "./Participant";
export * from "./Host";
export * from './HostAnswer';
export * from './CalculateScore';

import { QuestionTypes, SlideTypes, AnswerTypes,AwardPointsLocation,MapDetails } from "@/models/Quiz";
import { MapPinnedIcon } from "lucide-react";
import { SlideInfo } from "../..";

export const Info: SlideInfo = {
  value: "question:LOCATEIT",
  icon: MapPinnedIcon,
  label: "LocateIt",
  slideType: SlideTypes.question,
  questionType: QuestionTypes.LOCATEIT,
  interactivePreview: true,
  defaults: {
    location: {
      lat: 50.07,
      lng: 19.95,
    },
    mapDetails: MapDetails.NONE,
    awardPointsLocation: AwardPointsLocation.DISTANCE,
    answerType: AnswerTypes.location,
    points:1000,
    radius:300000,
  },
} as const;
