import { useCallback, useEffect, useState, useRef } from 'react';
import { JeopardySlide, Participant } from '@/models/Quiz';
import { useTimer } from '@/hooks';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathOnValue } from '@/hooks/usePathOnValue';
import { useAppContext } from '@/contexts/App/context';
import { useTranslation } from 'react-i18next';
import { SquareTimer } from '@/components/ui/square-timer';
import { getParticipants } from '@/mock/participants';
import Avatar from '@/Avatar';

interface Props {
  slide: JeopardySlide;
  participants: Participant[];
  quizCode: string;
  slideNumber: number;
  onNextSlide: () => void;
  changeTurn: (participantId: string, quizCode: string) => void;
}

type GameState =
  | { type: 'CATEGORY_SELECTION'; currentPlayer: Participant }
  | { type: 'SHOWING_QUESTION'; categoryId: string; questionIndex: number }
  | { type: 'WAITING_FOR_BUZZER' }
  | { type: 'PLAYER_ANSWERING'; participant: Participant }
  | { type: 'SHOWING_ANSWER' };

interface PlayerScore {
  participantId: string;
  score: number;
}

const mockParticipants = getParticipants(8);

export function Host({
  slide,
  participants = mockParticipants,
  onNextSlide = () => { },
  changeTurn = () => { },
  quizCode,
  slideNumber
}: Props) {
  const { t } = useTranslation('jeopardy');
  const {
    ongoingQuizzes: { optimisticUpdate },
  } = useAppContext();
  const initialTurnSet = useRef(false);
  const [gameState, setGameState] = useState<GameState>({
    type: 'CATEGORY_SELECTION',
    currentPlayer: participants[Math.floor(Math.random() * participants.length)]
  });
  const [scores, setScores] = useState<PlayerScore[]>(
    participants.map(p => ({ participantId: p.participantId, score: 0 }))
  );
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [selectedQuestion, setSelectedQuestion] = useState<{ categoryId: string; questionIndex: number } | null>(null);
  const [lastCorrectPlayer, setLastCorrectPlayer] = useState<Participant | null>(null);
  const [showFlash, setShowFlash] = useState(false);

  const mainTimer = useTimer({
    duration: slide.mainTimeLimit,
    onComplete: () => {
      if (gameState.type === 'WAITING_FOR_BUZZER') {
        clearTempAnswers();
        mainTimer.stop();
        setGameState({ type: 'SHOWING_ANSWER' });
      }
    },
  });

  const answerTimer = useTimer({
    duration: slide.answerTimeLimit,
    onComplete: () => {
      if (gameState.type === 'PLAYER_ANSWERING') {
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 200);
      }
    },
  });

  const updateParticipants = useCallback(
    (id: string, participants: { [key: string]: Participant }) => {
      optimisticUpdate(
        id,
        {
          participants,
        },
        true
      );
    },
    [optimisticUpdate]
  );

  usePathOnValue<Participant>(
    `ongoingQuizzes/${quizCode}/participants`,
    (participants) => {
      if (!quizCode) return;
      updateParticipants(quizCode, participants);
    }
  );

  const clearTempAnswers = useCallback(async () => {
    await optimisticUpdate(quizCode, {
      participants: participants.reduce((acc, p) => {
        acc[p.participantId] = { ...p, tempAnswer: undefined };
        return acc;
      }, {} as { [key: string]: Participant }),
    }, true);
  }, [participants, quizCode, optimisticUpdate]);

  const calculateQuestionValue = useCallback((index: number) => {
    const step = (slide.maxScore - slide.minScore) / 4;
    return Math.round(slide.minScore + (index * step));
  }, [slide.minScore, slide.maxScore]);

  const handleQuestionSelect = (categoryId: string, questionIndex: number) => {
    if (gameState.type !== 'CATEGORY_SELECTION') return;
    if (answeredQuestions.has(`${categoryId}-${questionIndex}`)) return;

    setSelectedQuestion({ categoryId, questionIndex });
    setGameState({ type: 'SHOWING_QUESTION', categoryId, questionIndex });
    changeTurn("PRE_BUZZER", quizCode);
  };

  const startBuzzerPhase = () => {
    if (gameState.type !== 'SHOWING_QUESTION') return;
    setGameState({ type: 'WAITING_FOR_BUZZER' });
    changeTurn("BUZZER", quizCode);
    mainTimer.start();
  };

  const handleBuzzer = async (participant: Participant) => {
    if (gameState.type !== 'WAITING_FOR_BUZZER') return;
    await clearTempAnswers();
    mainTimer.pause();
    answerTimer.start();
    setGameState({ type: 'PLAYER_ANSWERING', participant });
    changeTurn("BUZZER_" + participant.participantId, quizCode);
  };

  useEffect(() => {
    if (gameState.type !== 'WAITING_FOR_BUZZER') return;
    participants.forEach((participant) => {
      if (!participant.tempAnswer) return;
      if (participant.tempAnswer.tempAnswer === participant.participantId) {
        console.log("Participant buzzed", participant.name);
        handleBuzzer(participant);
      }
    });
  }, [participants, handleBuzzer, clearTempAnswers])

  const handleCorrectAnswer = async (participant: Participant) => {
    if (!selectedQuestion) return;
    answerTimer.stop();

    const questionValue = calculateQuestionValue(selectedQuestion.questionIndex);
    setScores(prev => prev.map(score =>
      score.participantId === participant.participantId
        ? { ...score, score: score.score + questionValue }
        : score
    ));

    setAnsweredQuestions(prev => new Set([...prev, `${selectedQuestion.categoryId}-${selectedQuestion.questionIndex}`]));
    setLastCorrectPlayer(participant);
    setGameState({ type: 'SHOWING_ANSWER' });
    changeTurn("POST_QUESTION", quizCode);
  };

  const handleIncorrectAnswer = async (participant: Participant) => {
    if (!selectedQuestion) return;
    changeTurn("POST_QUESTION", quizCode);
    answerTimer.stop();

    const questionValue = calculateQuestionValue(selectedQuestion.questionIndex);
    setScores(prev => prev.map(score =>
      score.participantId === participant.participantId
        ? { ...score, score: score.score - questionValue }
        : score
    ));

    setGameState({ type: 'WAITING_FOR_BUZZER' });
    changeTurn("BUZZER", quizCode);
    mainTimer.resume();
  };

  const moveToNextQuestion = async () => {
    if (answeredQuestions.size === slide.categories.length * 5) {
      // Game is complete, store final scores in participant.answers
      optimisticUpdate(quizCode, {
        participants: participants.reduce((acc, p) => {
          const score = scores.find(s => s.participantId === p.participantId)?.score || 0
          console.log(score)
          acc[p.participantId] = {
            ...p,
            score: [...(p.score || []), score],
            answers: [...(p.answers || []), {
              slideNumber,
              answer: [score.toString()],
              time: new Date().toISOString()
            }]
          };
          return acc;
        }, {} as { [key: string]: Participant }),
      });
      onNextSlide();
      return;
    }
    const nextPlayer = lastCorrectPlayer ? lastCorrectPlayer : participants[Math.floor(Math.random() * participants.length)];
    setGameState({
      type: 'CATEGORY_SELECTION',
      currentPlayer: nextPlayer
    });
    changeTurn(nextPlayer.participantId, quizCode);
    setSelectedQuestion(null);
  };

  // Set initial turn only once when component mounts
  useEffect(() => {
    if (!initialTurnSet.current && gameState.type === 'CATEGORY_SELECTION') {
      clearTempAnswers();
      changeTurn(gameState.currentPlayer?.participantId || "", quizCode);
      initialTurnSet.current = true;
    }
  }, [gameState.type, gameState, changeTurn, quizCode]);

  return (
    <div className="flex-1 flex flex-col w-full h-full text-white p-8">
      {/* Game Status */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-5xl font-bold w-full text-center">
          {gameState.type === 'CATEGORY_SELECTION' && (
            <span className="flex items-center justify-center gap-4">
              <Avatar
                width='52px'
                height='52px'
                avatarString={gameState.currentPlayer.avatar}
                collectionName={gameState.currentPlayer.collectionName}
              />
              <span className="font-black">{gameState.currentPlayer.name}'s</span> turn to choose
            </span>
          )}
          {gameState.type === 'WAITING_FOR_BUZZER' && mainTimer.timeLeft > 0 && (
            <span>Time remaining: {mainTimer.timeLeft}s</span>
          )}
          {gameState.type === 'PLAYER_ANSWERING' && (
            <span>{gameState.participant.name} is answering... ({answerTimer.timeLeft}s)</span>
          )}
        </div>
      </div>

      {/* Jeopardy Board */}
      {gameState.type === 'CATEGORY_SELECTION' && (
        <>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5 flex-1">
            {slide.categories.map((category) => (
              <div key={category.id} className="grid grid-rows-[auto_repeat(5,1fr)] gap-2.5">
                <div className="bg-black text-center text-4xl font-bold uppercase p-2.5 border-2 rounded-lg border-white min-h-[60px] flex items-center justify-center h-36">
                  {category.name}
                </div>
                {category.questions.map((_, index) => {
                  const isAnswered = answeredQuestions.has(`${category.id}-${index}`);
                  return (
                    <button
                      key={index}
                      disabled={isAnswered || gameState.type !== 'CATEGORY_SELECTION'}
                      onClick={() => handleQuestionSelect(category.id, index)}
                      className={cn(
                        "bg-black/75 border-2 border-white flex items-center justify-center text-6xl font-bold text-primary rounded-lg",
                        isAnswered && "opacity-50 cursor-not-allowed",
                        !isAnswered && "hover:bg-black/90 cursor-pointer"
                      )}
                    >
                      {calculateQuestionValue(index)}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          {/* Score Display */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {participants.map(participant => (
              <div key={participant.participantId} className="flex-1 bg-card rounded-lg p-4 text-black min-w-[280px]">
                <div className="flex items-center justify-center gap-2 text-3xl">
                  <Avatar
                    width='32px'
                    height='32px'
                    avatarString={participant.avatar}
                    collectionName={participant.collectionName}
                  />
                  <span className="font-black">{participant.name}</span>
                </div>
                <div className="text-4xl font-bold mt-1 text-center">
                  {scores.find(s => s.participantId === participant.participantId)?.score || 0}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Question Display */}
      {(gameState.type === 'SHOWING_QUESTION' || gameState.type === 'WAITING_FOR_BUZZER' || gameState.type === 'PLAYER_ANSWERING') && selectedQuestion && (
        <div className="flex-1 flex flex-col items-center justify-center text-8xl text-center px-16">
          <div className="mb-8 font-display">
            {slide.categories.find(c => c.id === selectedQuestion.categoryId)
              ?.questions[selectedQuestion.questionIndex].question}
          </div>
          {gameState.type === 'SHOWING_QUESTION' && (
            <Button className='mt-16 text-4xl py-8' size="lg" onClick={startBuzzerPhase}>{t('host.start')}</Button>
          )}
          {gameState.type === 'WAITING_FOR_BUZZER' && (
            <div className="mt-16 text-6xl font-bold text-primary">
              {mainTimer.timeLeft}s
            </div>
          )}
        </div>
      )}

      {/* Player Answering */}
      {gameState.type === 'PLAYER_ANSWERING' && (
        <div className="mt-16 flex flex-col items-center gap-8">
          <div className="text-4xl font-bold">
            {gameState.participant.name} {t('answering')}
          </div>
          <SquareTimer
            progress={(answerTimer.timeLeft / slide.answerTimeLimit) * 100}
            className="scale-150 mb-8"
          />
          <div className="flex justify-center gap-4">
            <Button
              className='text-4xl py-8'
              size="lg"
              variant="destructive"
              onClick={() => handleIncorrectAnswer(gameState.participant)}
            >
              {t('host.incorrect')}
            </Button>
            <Button
              className='text-4xl py-8'
              size="lg"
              variant="default"
              onClick={() => handleCorrectAnswer(gameState.participant)}
            >
              {t('host.correct')}
            </Button>
          </div>
        </div>
      )}

      {/* Answer Display */}
      {gameState.type === 'SHOWING_ANSWER' && selectedQuestion && (
        <div
          className="flex-1 flex flex-col items-center justify-center text-4xl cursor-pointer"
          onClick={moveToNextQuestion}
        >
          <div>
            {slide.categories.find(c => c.id === selectedQuestion.categoryId)
              ?.questions[selectedQuestion.questionIndex].answer}
          </div>
          <div className="text-xl mt-4">({t('clickToContinue')})</div>
        </div>
      )}

      {showFlash && (
        <div
          className="fixed inset-0 bg-white/30 pointer-events-none transition-opacity duration-200"
          style={{ zIndex: 50 }}
        />
      )}
    </div>
  );
} 