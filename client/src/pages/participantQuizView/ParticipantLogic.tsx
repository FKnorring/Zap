import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ParticipantService, useGameStatus } from '@/services/participant';
import TeamInfo from './components/ParticipantInfo';
import CreateParticipant from './components/CreateParticipant';
import { Zap } from 'lucide-react';
import { useCookies } from 'react-cookie';
import LobbyView from '@/pages/participantQuizView/components/LobbyView';
import HasAnsweredView from '@/pages/participantQuizView/components/HasAnsweredView';
import QuizEndedView from '@/pages/participantQuizView/components/QuizEndedView';
import { Participant, QuestionTypes, Slide } from '@/models/Quiz';
import { getSlideComponents } from '@/slides/utils';
import Spinner from '@/components/Spinner';
import ParticipantMenu from './components/ParticipantMenu';
import { QuizBackground } from '@/components/quiz-editor/QuizBackground';
import { QuizSettings } from '@/models/Quiz';

function QuizView({
  questions,
  currentSlide,
  participantData,
  answerQuestion,
  answerTempQuestion,
  turn,
  showAnswer,
  currentSlideTime,
}: {
  questions: Slide[] | undefined;
  currentSlide: number;
  participantData: Participant;
  answerQuestion: (answer: string[]) => Promise<void>;
  answerTempQuestion: (answer: string) => Promise<void>;
  turn: string;
  showAnswer: boolean;
  currentSlideTime: string;
}) {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (currentSlide > 0) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 150); // Flash duration
      return () => clearTimeout(timer);
    }
  }, [currentSlide]);

  if (!questions || !participantData) return <Spinner />;
  if (currentSlide === 0) return <LobbyView />;
  if (currentSlide > questions.length) return <QuizEndedView />;

  const currentQuestion = questions[currentSlide - 1];
  const SlideComponent = getSlideComponents(currentQuestion);

  // If we are on a question slide render the corresponding answerView
  if (showAnswer && 'ParticipantAnswer' in SlideComponent) {
    return (
      <SlideComponent.ParticipantAnswer
        slide={currentQuestion as never}
        participant={participantData}
      />
    );
  }

  if (
    participantData.hasAnswered ||
    (participantData.tempAnswer &&
      'questionType' in currentQuestion &&
      currentQuestion.questionType !== QuestionTypes.BOMB &&
      currentQuestion.questionType !== QuestionTypes.JEOPARDY)
  )
    return <HasAnsweredView />;

  return (
    <>
      {flash && (
        <div className="fixed inset-0 bg-white/60 animate-flash pointer-events-none z-50" />
      )}
      <SlideComponent.Participant
        slide={currentQuestion as never}
        answerQuestion={answerQuestion as never}
        answerTempQuestion={answerTempQuestion as never}
        participantData={participantData}
        turn={turn}
        currentSlideTime={currentSlideTime}
      />
    </>
  );
}

export default function ParticipantLogic() {
  var { quizCode } = useParams();
  quizCode = quizCode?.toUpperCase();

  const [participantId, setParticipantId] = useState<string | undefined>(
    undefined
  );
  const [cookies, setCookie, removeCookie] = useCookies(['participantId']);
  const [questions, setQuestions] = useState<Slide[]>();
  const [quizSettings, setQuizSettings] = useState<QuizSettings>();
  const navigate = useNavigate();

  const { currentSlide, participantData, showAnswer, turn, currentSlideTime } =
    useGameStatus(quizCode as string, participantId as string);

  // Fetch quiz and participant data
  useEffect(() => {
    const initialize = async () => {
      if (!quizCode) return;

      try {
        // Check if the ongoingQuiz exists, if not send the player back to /play
        const quizExists = await ParticipantService.checkIfGameExists(quizCode);
        if (!quizExists) {
          navigate('/play');
          removeCookie('participantId');
          return;
        }

        // Check if a cookie exists
        if (cookies.participantId) {
          const participant = await ParticipantService.getParticipant(
            quizCode,
            cookies.participantId
          );
          // Check if the cookie corresponds to a participant in this ongoingQuiz
          if (participant) {
            setParticipantId(cookies.participantId);

            const slides = await ParticipantService.getQuizSlides(quizCode);
            setQuestions(slides);
            const settings = await ParticipantService.getQuizSettings(quizCode);
            setQuizSettings(settings);
          } else {
            // Cookie corresponds to participant in different quiz, remove it
            removeCookie('participantId');
            setParticipantId(undefined);
          }
        }
      } catch (error) {
        console.error('Error initializing quiz:', error);
      }
    };

    initialize();
  }, [quizCode, cookies, navigate, removeCookie]);

  const handleRemoveParticipant = async () => {
    if (!quizCode || !participantId) return;
    try {
      const success = await ParticipantService.removeParticipant(
        quizCode,
        participantId
      );
      if (success) {
        removeCookie('participantId');
        navigate('/');
      }
    } catch (error) {
      console.error('Error removing participant:', error);
    }
  };

  const handleAddParticipant = async (
    participantName: string,
    participantAvatar: string,
    participantCollection: string
  ) => {
    if (
      !quizCode ||
      !participantName ||
      !participantAvatar ||
      !participantCollection
    )
      return;
    try {
      const createdId = await ParticipantService.addParticipant(
        quizCode,
        participantName,
        participantAvatar,
        participantCollection
      );
      if (createdId) {
        setCookie('participantId', createdId);
        setParticipantId(createdId);
        const slides = await ParticipantService.getQuizSlides(quizCode);
        setQuestions(slides);
      }
    } catch (error) {
      console.error('Error adding participant:', error);
    }
  };

  const answerTempQuestion = async (tempAnswer: string) => {
    if (!quizCode || !participantId) return;
    try {
      await ParticipantService.addTempAnswer(
        quizCode,
        participantId,
        tempAnswer
      );
      console.log('in answerTempQuestion');
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const answerQuestion = async (answer: string[]) => {
    if (!quizCode || !participantId || !answer) return;
    try {
      await ParticipantService.addAnswer(
        quizCode,
        participantId,
        answer,
        currentSlide - 1
      );
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  if (!participantId || !participantData) {
    return (
      <>
        <CreateParticipant handleAddParticipant={handleAddParticipant} />
      </>
    );
  }

  return (
    <div className="h-dvh flex flex-col w-full font-display">
      {/* Top */}
      <div className="grid grid-cols-3 items-center p-2 w-full bg-[#F4F3F2] text-[#333333]">
        <div className="flex items-center">
          <ParticipantMenu onLeave={handleRemoveParticipant} />
        </div>

        <div className="flex items-center justify-center text-xl">
          <Zap className="w-6 h-6 mr-1 text-primary" />
          Zap!
        </div>

        <div className="flex items-center justify-end text-xl">
          {currentSlide}/{questions?.length}
        </div>
      </div>

      {/* Middle: Quiz Question */}
      <div className="flex-grow flex flex-col w-full overflow-auto">
        <QuizView
          questions={questions}
          currentSlide={currentSlide}
          participantData={participantData}
          answerQuestion={answerQuestion}
          showAnswer={showAnswer}
          answerTempQuestion={answerTempQuestion}
          turn={turn}
          currentSlideTime={currentSlideTime}
        />
        {/* Render background*/}
        {quizSettings && (
          <QuizBackground
            backgroundColor={quizSettings.backgroundColor}
            primaryColor={quizSettings.primaryColor}
            secondaryColor={quizSettings.secondaryColor}
            style={questions && questions[currentSlide - 1]?.backgroundStyle}
            className="fixed inset-0 h-screen w-screen z-[-1] object-cover h-dvh"
            isDynamic
          />
        )}
      </div>

      {/* Bottom: Team info */}
      {showAnswer ||
        (currentSlide === 0 && <TeamInfo participant={participantData} />)}
    </div>
  );
}
