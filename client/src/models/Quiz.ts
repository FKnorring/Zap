import { BackgroundStyle } from "@/components/quiz-editor/QuizBackground";

export interface Quiz {
  id: string;
  quiz_name: string;
  user_id: string;
  created_at: string;
  played_at?: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  settings: QuizSettings;
  isHosted: boolean;
  slides: Slide[];
}

export interface QuizSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  showCorrectAnswerDefault: ShowCorrectAnswerTypes;
}

interface QuestionCreated {
  quiz_id: string;
  question_id: string;
  question_number: number;
}

export default Quiz;
export type { QuestionCreated };

export enum SlideTypes {
  info = "info",
  score = "score",
  question = "question",
}
export type SlideType = SlideTypes;

export enum QuestionTypes {
  MCQSA = "MCQSA",
  MCQMA = "MCQMA",
  FA = "FA",
  RANK = "RANK",
}
export type QuestionType = QuestionTypes;

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
}

export interface ScoreSlideInterface extends BaseSlide {
  type: SlideTypes.score;
  mockScores?: { name: string; points: number; newPoints: number }[];
}

export interface ScoreSlide extends BaseSlide {
  type: SlideTypes.score;
  mockScores?: { name: string; points: number; newPoints: number }[];
}

export enum answerTypes {
  singleString = "singleString", 
  multipleStrings = "multipleStrings",
  freeText = "freeText",
  rank = "rank",
}

export type answerType = answerTypes;

export enum ShowCorrectAnswerTypes {
  auto = "auto",
  manual = "manual",
  never = "never",
}

export interface QuestionSlideBase extends BaseSlide {
  type: SlideTypes.question;
  questionType: QuestionType;
  timeLimit: number; // in seconds, 0 means no limit
  answerType: answerType;
  answer: string[]; //TODO: kolla i options
  showCorrectAnswer: ShowCorrectAnswerTypes; // Lägg till knapp för show answer
}

export interface RankSlide extends QuestionSlideBase {
  ranking: string[];
  questionType: QuestionTypes.RANK;
  answerType: answerTypes.rank;
}

export interface MCQSASlide extends QuestionSlideBase {
  questionType: QuestionTypes.MCQSA;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  answerType: answerTypes.singleString;
}

export interface MCQMASlide extends QuestionSlideBase {
  questionType: QuestionTypes.MCQMA;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  answerType: answerTypes.multipleStrings;
}

export interface FASlide extends QuestionSlideBase {
  questionType: QuestionTypes.FA;
  correctAnswer: string;
  answerType: answerTypes.freeText;
}

export interface OngoingQuiz {
  id: string;
  startedAt: string;
  isShowingCorrectAnswer: boolean;
  currentSlide: number;
  quiz: Quiz;
  quizId: string;
  quizHost: string;
  participants: { [id: string]: Participant };
}
export interface Participant {
  answers: Array<{
    slideNumber: number;
    answer: string[];
    time: string;
  }>;
  hasAnswered: boolean;
  avatar: string;
  name: string;
  participantId: string;
  score: number;
}

export type Slide = InfoSlide | ScoreSlide | QuestionSlide;

export type QuestionSlide = MCQSASlide | MCQMASlide | FASlide | RankSlide;
