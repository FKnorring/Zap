import { BackgroundStyle } from "@/components/quiz-editor/QuizBackground";
import { Slide } from "./slides";
import { Participant } from "./participants";

export interface Quiz {
  id: string;
  quiz_name: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
  played_at?: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  settings: QuizSettings;
  isHosted: boolean;
  isShared: boolean;
  slides: Slide[];
}

export interface QuizSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  showCorrectAnswerDefault: ShowCorrectAnswerTypes;
  backgroundStyleDefault: BackgroundStyle | 'random';
}

export interface QuestionCreated {
  quiz_id: string;
  question_id: string;
  question_number: number;
}

export interface UserQuizzes {
  userId: string;
  quizId: string;
  quizName: string;
  isHosted: boolean;
  isShared: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface SharedQuizzes {
  userId: string;
  userName: string;
  userAvatar: string;
  collectionName: string;
  quizId: string;
  quizName: string;
  sharedAt: string;
}

export enum ShowCorrectAnswerTypes {
  auto = "auto",
  never = "never",
}

export interface OngoingQuiz {
  id: string;
  startedAt: string;
  turn: string;
  isShowingCorrectAnswer: boolean;
  currentSlide: number;
  currentSlideTime: string;
  quiz: Quiz;
  quizId: string;
  quizHost: string;
  teams?: {
    [teamId: string]: {
      name: string;
      participants: string[];
    };
  };
  participants: { [id: string]: Participant };
} 