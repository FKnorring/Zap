import { OptimisticCreate, OptimisticDelete, OptimisticUpdate } from "@/hooks/useOptimisticResource";
import Quiz, { OngoingQuiz } from "@/models/Quiz";
import User from "@/models/User";
import { createContext, useContext } from "react";

interface AppContextType {
  ongoingQuizzes: {
    resources: OngoingQuiz[];
    isLoading: boolean;
    optimisticCreate: OptimisticCreate<OngoingQuiz>;
    optimisticDelete: OptimisticDelete;
    optimisticUpdate: OptimisticUpdate<OngoingQuiz>;
    endQuiz: (quizCode: string) => Promise<boolean>;
  };
  quizzes: {
    resources: Quiz[];
    isLoading: boolean;
    optimisticCreate: OptimisticCreate<Quiz>;
    optimisticDelete: OptimisticDelete;
    optimisticUpdate: OptimisticUpdate<Quiz>;
    enrichResource: (id: string) => Promise<void>;
  };
  user: {
    user: User | null;
    updateUser: (user: User) => Promise<void>;
  };
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const useAppContext = () => {
  return useContext(AppContext);
}