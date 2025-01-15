import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppContext } from '@/contexts/App/context';
import { getFirebaseServices } from '@/firebase';
import { ref, get, serverTimestamp } from 'firebase/database';
import { quizCodes } from '@/data/quizCodes';
import { UserQuizzes, Quiz } from '@/models/Quiz';

export function useHostQuiz() {
  const navigate = useNavigate();
  const {
    quizzes: { optimisticUpdate: updateQuiz },
    ongoingQuizzes: { optimisticCreate: createOngoingQuiz },
  } = useAppContext();

  const generateQuizCode = async (): Promise<string> => {
    const { database } = getFirebaseServices();
    const maxAttempts = 4;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const randomIndex = Math.floor(Math.random() * quizCodes.length);
      const quizCode = quizCodes[randomIndex];
      const quizRef = ref(database, `ongoingQuizzes/${quizCode}`);
      const quiz = await get(quizRef);

      if (!quiz.exists()) {
        return quizCode;
      }

      attempts++;
    }

    let isUnique = false;
    let randomCode = '';

    while (!isUnique) {
      randomCode = Array.from({ length: 4 }, () =>
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      ).join('');

      const quizRef = ref(database, `ongoingQuizzes/${randomCode}`);
      const quiz = await get(quizRef);
      if (!quiz.exists()) {
        isUnique = true;
        return randomCode;
      }
    }
    return randomCode;
  };

  const hostQuizUser = async (quiz: UserQuizzes) => {
    try {
      const { database } = getFirebaseServices();
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
      toast.error('Failed to host quiz: ' + err);
    }
  };

  const hostQuizEditor = async (quiz: Quiz) => {
    try {
      const quizCode = await generateQuizCode();
      const quizData = quiz;

      const [{ error: createError }] = await Promise.all([
        createOngoingQuiz(
          {
            currentSlide: 0,
            quiz: quizData,
            quizId: quiz.id,
            quizHost: quiz.user_id,
            participants: {},
            currentSlideTime: serverTimestamp() as unknown as string,
            startedAt: new Date().toISOString().toLocaleString(),
          },
          quizCode
        ),
      ]);

      if (createError || !quizCode) {
        toast.error('Failed to host quiz');
        return;
      }

      toast.success('Quiz hosted successfully');
      navigate(`/quizzes/${quizCode}/lobby`);
    } catch (err) {
      console.error('Error creating ongoing quiz:', err);
      toast.error('Failed to host quiz: ' + err);
    }
  };

  return { hostQuizUser, hostQuizEditor };
}
