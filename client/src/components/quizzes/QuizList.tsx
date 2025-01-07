import { UserQuizzes } from '@/models/Quiz';
import { useNavigate } from 'react-router-dom';
import { QuizCard, MyQuizButtons } from './QuizCard';
import { toast } from 'sonner';
import { useAppContext } from '@/contexts/App/context';
import { database } from '@/firebase';
import { ref, get, serverTimestamp } from 'firebase/database';

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
  const {
    quizzes: { optimisticUpdate: updateQuiz },
    ongoingQuizzes: { optimisticCreate: createOngoingQuiz },
  } = useAppContext();

  const generateQuizCode = async (): Promise<string> => {
    let quizCode = '';
    let isUnique = false;

    while (!isUnique) {
      // Generate a random 4-letter code
      quizCode = Array.from({ length: 4 }, () =>
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      ).join('');

      const quizRef = ref(database, `ongoingQuizzes/${quizCode}`);
      const quiz = await get(quizRef);
      if (!quiz.exists()) {
        isUnique = true;
        return quizCode;
      }
    }
    return quizCode;
  };

  const handleHostGame = async (quiz: UserQuizzes) => {
    try {
      const quizCode = await generateQuizCode();
      const quizRef = ref(database, `quizzes/${quiz.quizId}`);
      const quizSnapshot = await get(quizRef);
      const quizData = quizSnapshot.val();
      const [{ error: updateError }, { error: createError }] =
        await Promise.all([
          updateQuiz(quiz.quizId, { isHosted: true }),
          createOngoingQuiz(
            {
              currentSlide: 0,
              quiz: quizData,
              quizId: quiz.quizId,
              quizHost: quiz.userId,
              participants: {},
              currentSlideTime: serverTimestamp() as unknown as string,
              startedAt: new Date().toISOString().toLocaleString(),
            },
            quizCode
          ),
        ]);

      if (updateError || createError || !quizCode) {
        toast.error('Failed to host quiz');
        return;
      }

      toast.success('Quiz hosted successfully');
      navigate(`/quizzes/${quizCode}/lobby`);
    } catch (err) {
      console.error('Error creating ongoing quiz:', err);
      toast.error('Failed to host quiz' + err);
    }
  };

  const filteredQuizzes = searchTerm
    ? quizzes.filter((quiz) =>
        quiz.quizName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : quizzes;

  return (
    <div className="flex overflow-x-auto overflow-y-visible gap-2 bg- pt-2">
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
                onHost={handleHostGame}
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
