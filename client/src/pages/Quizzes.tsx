import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import CreateQuizPopover from '@/components/quizzes/CreateQuizPopover';
import QuizList from '@/components/quizzes/QuizList';
import SharedQuizList from '@/components/quizzes/SharedQuizList';
import { useCallback, useEffect, useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SharedQuizzes } from '@/models/Quiz';
import { useAppContext } from '@/contexts/App/context';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { quizService } from '@/services/quizzes';
import { useTranslation } from 'react-i18next';

function useQuizzesPage() {
  const {
    quizzes: {
      resources: quizzes,
      isLoading: quizzesLoading,
      optimisticCreate,
      optimisticDelete,
      optimisticUpdate,
    },
    user: { user },
    ongoingQuizzes: { resources: ongoingQuizzes },
  } = useAppContext();

  const [sharedQuizzes, setSharedQuizzes] = useState<SharedQuizzes[]>([]);
  const [sharedQuizzesLoading, setSharedQuizzesLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setSharedQuizzesLoading(true);
      quizService.listShared(user.id).then(({ data }) => {
        setSharedQuizzes(data || []);
        setSharedQuizzesLoading(false);
      });
    }
  }, [user]);

  const handleCreateQuiz = useCallback(
    async (name: string) => {
      if (!user) return;

      // Create optimistic quiz from userQuiz data
      const { error } = await optimisticCreate({
        quiz_name: name,
        user_id: user.id,
      });

      if (error) {
        toast.error('Failed to create quiz' + error.message);
        return;
      }

      toast.success('Quiz created successfully');
    },
    [user, optimisticCreate]
  );

  const handleDeleteQuiz = useCallback(
    async (quizId: string) => {
      const { error } = await quizService.deleteQuiz(quizId);

      if (error) {
        toast.error('Failed to delete quiz');
        return;
      }

      optimisticDelete(quizId);
      toast.success('Quiz deleted successfully');
    },
    [optimisticDelete]
  );

  const handleShareQuiz = useCallback(
    async (quizId: string, quizName: string) => {
      if (!user) return;

      const { data: isShared, error } = await quizService.shareQuiz(
        quizId,
        user,
        quizName
      );

      if (error) {
        toast.error('Failed to share quiz');
        return;
      }

      optimisticUpdate(quizId, { isShared: isShared ?? false });
      if (isShared) {
        toast.success(`Quiz ${quizName} was successfully shared`);
      }
    },
    [optimisticUpdate, user]
  );

  const handleCopyQuiz = useCallback(
    async (quiz: SharedQuizzes) => {
      if (!user) return;

      const { data: newQuiz, error } = await quizService.copyQuiz(
        quiz,
        user.id
      );

      if (error || !newQuiz) {
        toast.error('Failed to copy quiz');
        return;
      }

      optimisticCreate(newQuiz);
      toast.success('Quiz copied successfully');
    },
    [user, optimisticCreate]
  );

  const ongoingQuiz = ongoingQuizzes.find((quiz) => quiz.quizHost !== user?.id);

  return {
    quizzes,
    quizzesLoading,
    sharedQuizzes,
    sharedQuizzesLoading,
    handleCreateQuiz,
    handleDeleteQuiz,
    handleShareQuiz,
    handleCopyQuiz,
    ongoingQuiz,
  };
}

function Quizzes() {
  const {
    quizzes,
    quizzesLoading,
    sharedQuizzes,
    sharedQuizzesLoading,
    handleCreateQuiz,
    handleDeleteQuiz,
    handleShareQuiz,
    handleCopyQuiz,
    ongoingQuiz,
  } = useQuizzesPage();

  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex-1 flex flex-col items-center justify-around gap-4 overflow-y-auto p-4">
      <Card className="w-full max-w-7xl" id="quiz-manager-container">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{t('homepage:myQuizzes')}</span>
            {ongoingQuiz && (
              <Button
                variant="outline"
                onClick={() => navigate(`/quizzes/${ongoingQuiz.id}/lobby`)}
              >
                {t('homepage:gotoOngoing')}
              </Button>
            )}
            <CreateQuizPopover onCreateQuiz={handleCreateQuiz} />
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          {quizzesLoading ? (
            <div className="flex justify-center items-center h-[300px] w-full">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <QuizList
              quizzes={quizzes.map((quiz) => ({
                quizId: quiz.id,
                quizName: quiz.quiz_name,
                userId: quiz.user_id,
                isHosted: quiz.isHosted,
                isShared: quiz.isShared,
                createdAt: quiz.created_at,
                updatedAt: quiz.updated_at,
              }))}
              onDeleteQuiz={handleDeleteQuiz}
              onShareQuiz={handleShareQuiz}
            />
          )}
        </CardContent>
      </Card>

      <Card className="w-full max-w-7xl">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-4">
              <span className="m-0">{t('homepage:sharedQuizzes')}</span>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('homepage:searchShared')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-lg"
                />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          {sharedQuizzesLoading ? (
            <div className="flex justify-center items-center h-[300px] w-full">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <SharedQuizList
              quizzes={sharedQuizzes}
              onCopyQuiz={handleCopyQuiz}
              searchTerm={searchTerm}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Quizzes;
