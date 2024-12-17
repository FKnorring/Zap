import { Routes, Route } from "react-router-dom";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import React, { Suspense } from "react";
import Spinner from "@/components/Spinner";
import { useTutorialTrigger } from "@/hooks/useTutorialTrigger";

const About = React.lazy(() => import("../pages/About"));
const Home = React.lazy(() => import("../pages/Home"));
const Quizzes = React.lazy(() => import("../pages/Quizzes"));
const StartScreen = React.lazy(() => import("@/pages/joinQuiz/StartScreen"));
const QuizView = React.lazy(() => import("../pages/QuizView"));
const QuizEdit = React.lazy(() => import("../pages/QuizEdit"));
const ParticipantLogic = React.lazy(
  () => import("@/pages/participantQuizView/ParticipantLogic")
);
const Profile = React.lazy(() => import("@/pages/User/Profile"));
const HostLogic = React.lazy(() => import("@/pages/HostLogic"));

export function AppRoutes() {
  const { isAuthenticated } = useKindeAuth();

  useTutorialTrigger();

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Quizzes /> : <Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/play" element={<StartScreen />} />
        <Route path="/quizzes/:id" element={<QuizView />} />
        <Route path="/quizzes/:id/edit" element={<QuizEdit />} />
        <Route path="/play/:quizCode/" element={<ParticipantLogic />} />
        <Route path="/quizzes/:id/lobby" element={<HostLogic />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Suspense>
  );
}
