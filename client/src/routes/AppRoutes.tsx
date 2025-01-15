import { Routes, Route } from 'react-router-dom';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import React, { Suspense } from 'react';
import Spinner from '@/components/Spinner';
import { useTutorialTrigger } from '@/hooks/useTutorialTrigger';
import ErrorBoundary from '@/components/errors/ErrorBoundary';

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

  const wrapInErrorBoundary = (component: React.ReactNode) => (
    <ErrorBoundary>{component}</ErrorBoundary>
  );

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={wrapInErrorBoundary(isAuthenticated ? <Quizzes /> : <Home />)} />
        <Route path="/about" element={wrapInErrorBoundary(<AboutPage />)} />
        <Route path="/play" element={wrapInErrorBoundary(<JoinQuiz />)} />
        <Route path="/quizzes/:id/edit" element={wrapInErrorBoundary(<QuizEdit />)} />
        <Route path="/play/:quizCode/" element={wrapInErrorBoundary(<ParticipantLogic />)} />
        <Route path="/quizzes/:id/lobby" element={wrapInErrorBoundary(<HostLogic />)} />
        <Route path="/profile" element={wrapInErrorBoundary(<Profile />)} />
        <Route path="/tools/:tool" element={wrapInErrorBoundary(<Tools />)} />
      </Routes>
    </Suspense>
  );
}
