import Quiz from "@/models/Quiz";
import { useNavigate } from "react-router-dom";
import { QuizCard, MyQuizButtons, SharedQuizButtons } from "./QuizCard";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/App/context";
import { database } from "@/firebase";
import { ref, get } from "firebase/database";

interface QuizListProps {
  quizzes: Quiz[];
  variant: "my-quizzes" | "shared-quizzes";
  onDeleteQuiz?: (quizId: string) => Promise<void>;
  onShareQuiz?: (quizId: string) => Promise<void>;
  onCopyQuiz?: (quiz: Quiz) => Promise<void>;
  searchTerm?: string;
}

function QuizList({
  quizzes,
  variant,
  onDeleteQuiz,
  onShareQuiz,
  onCopyQuiz,
  searchTerm = "",
}: QuizListProps) {
  const navigate = useNavigate();
  const {
    quizzes: { optimisticUpdate: updateQuiz },
    ongoingQuizzes: { optimisticCreate: createOngoingQuiz },
  } = useAppContext();

  const generateQuizCode = async (): Promise<string> => {
    let quizCode = "";
    let isUnique = false;

    while (!isUnique) {
      // Generate a random 4-letter code
      quizCode = Array.from({ length: 4 }, () =>
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      ).join("");

      const quizRef = ref(database, `ongoingQuizzes/${quizCode}`);
      const quiz = await get(quizRef);
      if (!quiz.exists()) {
        isUnique = true;
        return quizCode;
      }
    }
    return quizCode;
  };

  const handleHostGame = async (quiz: Quiz) => {
    try {
      const quizCode = await generateQuizCode();
      const [{ error: updateError }, { error: createError }] =
        await Promise.all([
          updateQuiz(quiz.id, { isHosted: true }),
          createOngoingQuiz(
            {
              currentSlide: 0,
              quiz: quiz,
              quizId: quiz.id,
              quizHost: quiz.user_id,
              participants: {},
              startedAt: new Date().toISOString().toLocaleString(),
            },
            quizCode
          ),
        ]);

      if (updateError || createError || !quizCode) {
        toast.error("Failed to host quiz");
        return;
      }

      toast.success("Quiz hosted successfully");
      navigate(`/quizzes/${quizCode}/lobby`);
    } catch (err) {
      console.error("Error creating ongoing quiz:", err);
      toast.error("Failed to host quiz" + err);
    }
  };

  const filteredQuizzes = searchTerm
    ? quizzes.filter((quiz) =>
        quiz.quiz_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : quizzes;

  return (
    <div className="flex overflow-x-auto overflow-y-visible gap-2 pb-2">
      {filteredQuizzes
        .sort((a, b) => {
          const aDate = a.updated_at || a.created_at;
          const bDate = b.updated_at || b.created_at;
          return new Date(bDate).getTime() - new Date(aDate).getTime();
        })
        .map((quiz) => (
          <div key={quiz.id} className="flex-none w-[300px]">
            <QuizCard
              quiz={quiz}
              variant={variant}
              onClick={
                variant === "shared-quizzes"
                  ? undefined
                  : () => navigate(`/quizzes/${quiz.id}/edit`)
              }
            >
              {variant === "my-quizzes" && onDeleteQuiz && onShareQuiz && (
                <MyQuizButtons
                  quiz={quiz}
                  onHost={handleHostGame}
                  onShare={onShareQuiz}
                  onDelete={onDeleteQuiz}
                />
              )}
              {variant === "shared-quizzes" && onCopyQuiz && (
                <SharedQuizButtons quiz={quiz} onCopyToMyQuizzes={onCopyQuiz} />
              )}
            </QuizCard>
          </div>
        ))}
    </div>
  );
}

export default QuizList;
