import { BackgroundStyle } from "@/components/quiz-editor/QuizBackground";
import type { QuestionSlide } from "./questions";

export enum SlideTypes {
  info = "info",
  score = "score",
  question = "question",
  lobby = "lobby",
  bulletPoint = "bulletPoint"
}

export type SlideType = SlideTypes;

export interface BaseSlide {
  id: string;
  title: string;
  content?: string;
  imageUrl?: string;
  imageScale?: number;
  backgroundStyle?: BackgroundStyle;
  type: SlideType;
}

export interface InfoSlide extends BaseSlide {
  type: SlideTypes.info;
  embedVideoUrl?: string;
}

export interface LobbySlide extends BaseSlide {
  type: SlideTypes.lobby;
  quizCode: string;
}

export interface ScoreSlide extends BaseSlide {
  type: SlideTypes.score;
}

export interface BulletPointSlide extends BaseSlide {
  type: SlideTypes.bulletPoint;
  points: string[];
  imageUrl?: string;
  imagePosition: 'left' | 'right';
  fontSize: number;
  pointSpacing: number;
}

export type Slide = InfoSlide | ScoreSlide | QuestionSlide | LobbySlide | BulletPointSlide; 