import { quizService } from "@/services/quizzes";
import { createOptimisticResourceHook } from "./useOptimisticResource";
import Quiz from "@/models/Quiz";

const useQuizzes = createOptimisticResourceHook<Quiz>({
  api: quizService,
  userScoped: true,
  enrichResource: async (id: string) => {
    return await quizService.getById(id);
  }
});

export { useQuizzes };