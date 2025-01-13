import { SharedQuizzes } from '@/models/Quiz';
import { SharedQuizCard, SharedQuizButtons } from './SharedQuizCard';

interface SharedQuizListProps {
  quizzes: SharedQuizzes[];
  onCopyQuiz: (quiz: SharedQuizzes) => Promise<void>;
  searchTerm?: string;
}

export default function SharedQuizList({
  quizzes,
  onCopyQuiz,
  searchTerm = '',
}: SharedQuizListProps) {
  const filteredQuizzes = searchTerm
    ? quizzes.filter((quiz) =>
        quiz.quizName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : quizzes;

  return (
    <div className="flex overflow-x-auto overflow-y-visible gap-2 pt-5">
      {filteredQuizzes
        .sort((a, b) => {
          const aDate = a.sharedAt;
          const bDate = b.sharedAt;
          return new Date(bDate).getTime() - new Date(aDate).getTime();
        })
        .map((quiz) => (
          <div key={quiz.quizId} className="flex-none w-[300px]">
            <SharedQuizCard quiz={quiz}>
              <SharedQuizButtons quiz={quiz} onCopyToMyQuizzes={onCopyQuiz} />
            </SharedQuizCard>
          </div>
        ))}
    </div>
  );
}
