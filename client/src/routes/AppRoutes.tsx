import { Routes, Route } from 'react-router-dom';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import React, { Suspense } from 'react';
import Spinner from '@/components/Spinner';
import { useTutorialTrigger } from '@/hooks/useTutorialTrigger';

const AboutPage = React.lazy(() => import('@/pages/about/index'));
const Home = React.lazy(() => import('@/pages/home/Home'));
const Tools = React.lazy(() => import('@/pages/Tools/Tools'));
const Quizzes = React.lazy(() => import('@/pages/Quizzes'));
const JoinQuiz = React.lazy(() => import('@/pages/JoinQuiz'));
const QuizEdit = React.lazy(() => import('@/pages/QuizEdit'));
const ParticipantLogic = React.lazy(
  () => import('@/pages/participantQuizView/ParticipantLogic')
);
const Profile = React.lazy(() => import('@/components/Settings/Profile'));
const HostLogic = React.lazy(() => import('@/pages/HostLogic'));

export function AppRoutes() {
  const { isAuthenticated } = useKindeAuth();

  useTutorialTrigger();

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Quizzes /> : <Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/play" element={<JoinQuiz />} />
        <Route path="/quizzes/:id/edit" element={<QuizEdit />} />
        <Route path="/play/:quizCode/" element={<ParticipantLogic />} />
        <Route path="/quizzes/:id/lobby" element={<HostLogic />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tools/:tool" element={<Tools />} />
      </Routes>
    </Suspense>
  );
}
