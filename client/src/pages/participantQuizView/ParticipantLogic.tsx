import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ParticipantService, useGameStatus } from '@/services/participant';
import TeamInfo from './components/ParticipantInfo';
import CreateParticipant from './components/CreateParticipant';
import { LogOut, Zap } from 'lucide-react';
import { useCookies } from 'react-cookie';
import LobbyView from '@/pages/participantQuizView/components/LobbyView';
import HasAnsweredView from '@/pages/participantQuizView/components/HasAnsweredView';
import QuizEndedView from '@/pages/participantQuizView/components/QuizEndedView';
import { Participant, Slide } from '@/models/Quiz';
import { getSlideComponents } from '@/slides/utils';

function QuizView({
  questions,
  currentSlide,
  participantData,
  answerQuestion,
  answerTempQuestion,

  showAnswer,
}: {
  questions: Slide[] | undefined;
  currentSlide: number;
  participantData: Participant;
  answerQuestion: (answer: string[]) => Promise<void>;
  answerTempQuestion: (answer: string) => Promise<void>;

  showAnswer: boolean;
}) {
  if (!questions || !participantData) return <div>Loading Questions...</div>;
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
    (participantData.tempAnswer && !participantData.isTurn)
  )
    return <HasAnsweredView />;

  return (
    <SlideComponent.Participant
      slide={currentQuestion as never}
      answerQuestion={answerQuestion as never}
      answerTempQuestion={answerTempQuestion as never}
      isTurn={participantData.isTurn}
    />
  );
}

export default function ParticipantLogic() {
  const { quizCode } = useParams();
  const [participantId, setParticipantId] = useState<string | undefined>(
    undefined
  );
  const [cookies, setCookie, removeCookie] = useCookies(['participantId']);
  const [questions, setQuestions] = useState<Slide[]>();
  const navigate = useNavigate();

  const { currentSlide, participantData, showAnswer } = useGameStatus(
    quizCode as string,
    participantId as string
  );

  useEffect(() => {
    console.log(currentSlide);
    navigator.vibrate(500);
  }, [currentSlide]);

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
        navigate('/play');
      }
    } catch (error) {
      console.error('Error removing participant:', error);
    }
  };

  const handleAddParticipant = async (
    participantName: string,
    participantAvatar: string
  ) => {
    if (!quizCode || !participantName || !participantAvatar) return;
    try {
      const createdId = await ParticipantService.addParticipant(
        quizCode,
        participantName,
        participantAvatar
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
    return <CreateParticipant handleAddParticipant={handleAddParticipant} />;
  }

  return (
    <div className="h-dvh flex flex-col w-full font-display">
      {/* Top: Leave functionality */}
      <div className="flex p-2 w-full bg-[#F4F3F2] text-[#333333]">
        <div className="flex-1 flex items-center justify-start">
          <Button variant="outline" onClick={handleRemoveParticipant}>
            <LogOut />
            Leave
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center text-xl">
          <Zap className="w-6 h-6 mr-1 text-primary" />
          Zap!
        </div>

        <div className="flex-1 flex items-center justify-end text-xl">
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
        />
      </div>

      {/* Bottom: Team info */}
      {showAnswer && <TeamInfo participant={participantData} />}
    </div>
  );
}
