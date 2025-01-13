import { UserQuizzes } from '@/models/Quiz';
import { useNavigate } from 'react-router-dom';
import { QuizCard, MyQuizButtons } from './QuizCard';
import { useHostQuiz } from '@/hooks/useHostQuiz';

interface QuizListProps {
  quizzes: UserQuizzes[];
  onDeleteQuiz: (quizId: string) => Promise<void>;
  onShareQuiz: (quizId: string, quizName: string) => Promise<void>;
  searchTerm?: string;
}

function QuizList({
  quizzes,
  onDeleteQuiz,
  onShareQuiz,
  searchTerm = '',
}: QuizListProps) {
  const navigate = useNavigate();
  const { hostQuizUser } = useHostQuiz();

  const handleHostGame = async (quiz: UserQuizzes) => {
    try {
      await hostQuizUser(quiz);
    } catch (error) {
      console.error('Error hosting quiz', error);
    }
  };

  const filteredQuizzes = searchTerm
    ? quizzes.filter((quiz) =>
        quiz.quizName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : quizzes;

  return (
    <div className="flex overflow-x-auto overflow-y-visible gap-2 pt-1">
      {filteredQuizzes
        .sort((a, b) => {
          const aDate = a.updatedAt || a.createdAt;
          const bDate = b.updatedAt || b.createdAt;
          return new Date(bDate).getTime() - new Date(aDate).getTime();
        })
        .map((quiz, index) => (
          <div
            key={quiz.quizId}
            className="flex-none w-[300px]"
            id={index === 0 ? 'first-quiz-card' : undefined}
          >
            <QuizCard
              quiz={quiz}
              onClick={() => navigate(`/quizzes/${quiz.quizId}/edit`)}
            >
              <MyQuizButtons
                quiz={quiz}
                onHost={handleHostGame} // Use the new handler
                onShare={onShareQuiz}
                onDelete={onDeleteQuiz}
              />
            </QuizCard>
          </div>
        ))}
    </div>
  );
}

export default QuizList;
