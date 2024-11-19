import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addAnswer,
  useGameStatus,
  addParticipant,
  removeParticipant,
  getParticipant,
  checkIfGameExists,
  participantExists,
  getQuizSlides,
} from "@/services/client";
import TeamInfo from "./components/teamInfo";
import CreateParticipant from "./components/CreateParticipant";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import LobbyView from "@/components/quiz-phone-view/LobbyView";
import HasAnsweredView from "@/components/quiz-phone-view/HasAnsweredView";
import QuizEndedView from "@/components/quiz-phone-view/QuizEndedView";
import McqsaView from "@/components/quiz-phone-view/McqsaView";
import InfoView from "@/components/quiz-phone-view/InfoView";
import McqmaView from "@/components/quiz-phone-view/McqmaView";
import ScoreView from "@/components/quiz-phone-view/ScoreView";
import RankView from "@/components/quiz-phone-view/RankView";
import FastAnswerView from "@/components/quiz-phone-view/FastAnswerView";
import { InfoSlide, Slide } from "@/models/Quiz";

export default function ParticipantLogic() {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const { quizCode } = useParams();
  const [participantId, setParticipantId] = useState<string | undefined>(
    undefined,
  );
  const [cookies, setCookie, removeCookie] = useCookies(["participantId"]);
  const [questions, setQuestions] = useState<Slide[]>();
  const navigate = useNavigate();

  const { hasAnswered, currentSlide, score } = useGameStatus(
    quizCode as string,
    participantId as string,
  );

  useEffect(() => {
    const checkQuiz = async () => {
      if (!quizCode) return;

      try {
        const quizExists = await checkIfGameExists(quizCode);

        if (!quizExists) {
          navigate("/play");
          removeCookie("participantId");
        }
      } catch (error) {
        console.error("Error checking quiz existence:", error);
      }
    };

    const fetchParticipant = async () => {
      if (!quizCode || !cookies.participantId) return;

      try {
        const exists = await participantExists(quizCode, cookies.participantId);
        // The participant has either been removed or was from another quiz
        if (!exists) {
          removeCookie("participantId");
          setParticipantId(undefined);
          return;
        }

        const data = await getParticipant(quizCode, cookies.participantId);
        setParticipantId(cookies.participantId);
        setName(data.name);
        setAvatar(data.avatar);
        const questions = await getQuizSlides(quizCode);
        setQuestions(questions);
      } catch (error) {
        console.error("Error fetching participant data:", error);
      }
    };

    checkQuiz();
    fetchParticipant();
  }, [cookies, quizCode, navigate, removeCookie]);

  async function handleRemoveParticipant() {
    if (!quizCode || !participantId) return;
    const res = await removeParticipant(quizCode, participantId);
    if (res) {
      removeCookie("participantId");
      navigate("/play");
    }
  }

  async function handleAddParticipant() {
    const createdId = await addParticipant(quizCode as string, name, avatar);
    setCookie("participantId", createdId);
    setParticipantId(createdId);
    const questions = await getQuizSlides(quizCode as string);
    setQuestions(questions);
  }

  async function answerQuestion(answer: string) {
    if (!quizCode || !participantId || !answer) return;
    await addAnswer(quizCode, participantId, answer);
  }

  // Check if a participant has been created
  if (!participantId) {
    return (
      <CreateParticipant
        name={name}
        avatar={avatar}
        setName={setName}
        setAvatar={setAvatar}
        handleAddParticipant={handleAddParticipant}
      />
    );
  }

  // TODO: Kan nog skrivas om bättre.
  function QuizView() {
    if (!questions) return <div>Loading Questions...</div>;
    if (currentSlide === 0) return <LobbyView />;
    if (hasAnswered) return <HasAnsweredView />;
    if (currentSlide > questions.length) return <QuizEndedView />;

    const currentQuestion = questions?.[currentSlide - 1];

    if (currentQuestion.type === "info")
      return <InfoView slide={currentQuestion as InfoSlide} />;
    if (currentQuestion.type === "score") return <ScoreView />;

    if (currentQuestion.type === "question") {
      const questionType = currentQuestion.questionType;
      if (questionType === "MCQMA") {
        return (
          <McqmaView
            answerQuestion={answerQuestion}
            question={currentQuestion}
          />
        );
      } else if (questionType === "MCQSA") {
        return (
          <McqsaView
            answerQuestion={answerQuestion}
            question={currentQuestion}
          />
        );
      } else if (questionType === "FA") {
        return (
          <FastAnswerView
            question={currentQuestion}
            answerQuestion={answerQuestion}
          />
        );
      } else if (questionType === "rank") {
        return (
          <RankView
            question={currentQuestion}
            answerQuestion={answerQuestion}
          />
        );
      }
    }

    // TODO: När en frågetyp inte stöds
    return (
      <div>
        <h1>Unsupported question type</h1>
        <p>{JSON.stringify(currentQuestion)}</p>
      </div>
    );
  }

  return (
    <div>
      {/*Top: Leave functionality*/}
      <div className="fixed top-2 left-2 bg-[#F4F3F2] text-[#333333] rounded-md">
        <Button variant="ghost" onClick={handleRemoveParticipant}>
          <LogOut />
          Leave
        </Button>
      </div>
      {/*Middle: Quiz Question*/}
      <QuizView />
      {/*Bottom: Team info */}
      <TeamInfo name={name} score={score} avatar={avatar} />
    </div>
  );
}
