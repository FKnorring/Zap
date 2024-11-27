import { QuestionType, Slide, SlideType } from "@/models/Quiz";
import { Info, Score, Lobby, MCQSA, MCQMA, FTA, Rank, FA } from "./";

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
        default:
          throw new Error(`Unknown question type: ${questionType}`);
      }
    default:
      throw new Error(`Unknown slide type: ${type}`);
  }
}
