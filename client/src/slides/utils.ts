import { QuestionType, Slide, SlideType } from "@/models/Quiz";
import {
  Info,
  Score,
  Lobby,
  MCQSA,
  MCQMA,
  FTA,
  Rank,
  Matching,
  FA,
  LocateIt, Bomb,
} from "./";
import { toolbarConfigs } from "./toolbar";

export function getSlideComponents(slide: Slide) {
  if ("questionType" in slide) {
    return getSlideComponentsFromType(slide.type, slide.questionType);
  }
  return getSlideComponentsFromType(slide.type);
}

export function getSlideComponentsFromType(
  type: SlideType,
  questionType?: QuestionType
) {
  switch (type) {
    case "info":
      return Info;
    case "score":
      return Score;
    case "lobby":
      return Lobby;
    case "question":
      switch (questionType) {
        case "MCQSA":
          return MCQSA;
        case "MCQMA":
          return MCQMA;
        case "FTA":
          return FTA;
        case "RANK":
          return Rank;
        case "FA":
          return FA;
        case "MATCHING":
          return Matching;
        case "LOCATEIT":
          return LocateIt;
        case "BOMB":
          return Bomb;
        default:
        
        
          throw new Error(`Unknown question type: ${questionType}`);
      }
    default:
      throw new Error(`Unknown slide type: ${type}`);
  }
}

export function getToolbarConfig(slide: Slide) {
  if ("questionType" in slide) {
    return toolbarConfigs[slide.questionType];  
  }
  return toolbarConfigs[slide.type];
}
