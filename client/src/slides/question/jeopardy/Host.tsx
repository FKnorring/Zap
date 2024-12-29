import { useCallback, useEffect, useState, useRef } from 'react';
import { JeopardySlide, Participant } from '@/models/Quiz';
import { useTimer } from '@/hooks';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathOnValue } from '@/hooks/usePathOnValue';
import { useAppContext } from '@/contexts/App/context';

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

export function Host({ slide, participants, onNextSlide, changeTurn, quizCode, slideNumber }: Props) {
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

  const mainTimer = useTimer({
    duration: slide.timeLimit,
    onComplete: () => {
      if (gameState.type === 'WAITING_FOR_BUZZER') {
        setGameState({ type: 'SHOWING_ANSWER' });
      }
    },
  });

  const answerTimer = useTimer({
    duration: 5, // 5 seconds to answer
    onComplete: () => {
      if (gameState.type === 'PLAYER_ANSWERING') {
        handleIncorrectAnswer(gameState.participant);
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

  const clearTempAnswers = useCallback(() => {
    optimisticUpdate(quizCode, {
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

  const handleBuzzer = (participant: Participant) => {
    if (gameState.type !== 'WAITING_FOR_BUZZER') return;
    mainTimer.pause();
    answerTimer.start();
    setGameState({ type: 'PLAYER_ANSWERING', participant });
    changeTurn("BUZZER_" + participant.participantId, quizCode);
  };

  useEffect(() => {
    participants.forEach((participant) => {
      if (participant.tempAnswer?.time) {
        handleBuzzer(participant);
      }
    });
  }, [participants, handleBuzzer])

  const handleCorrectAnswer = (participant: Participant) => {
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
    clearTempAnswers();
  };

  const handleIncorrectAnswer = (participant: Participant) => {
    if (!selectedQuestion) return;
    answerTimer.stop();
    
    const questionValue = calculateQuestionValue(selectedQuestion.questionIndex);
    setScores(prev => prev.map(score => 
      score.participantId === participant.participantId 
        ? { ...score, score: score.score - questionValue }
        : score
    ));

    setGameState({ type: 'WAITING_FOR_BUZZER' });
    clearTempAnswers();
    changeTurn("BUZZER", quizCode);
    mainTimer.resume();
  };

  const moveToNextQuestion = () => {
    if (answeredQuestions.size === slide.categories.length * 5) {
      // Game is complete, store final scores in participant.answers
      participants.forEach(participant => {
        const finalScore = scores.find(s => s.participantId === participant.participantId)?.score || 0;
        participant.answers.push({
          slideNumber,
          answer: [finalScore.toString()],
          time: new Date().toISOString()
        });
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
    clearTempAnswers();
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
        <div className="text-2xl font-bold">
          {gameState.type === 'CATEGORY_SELECTION' && (
            <span>{gameState.currentPlayer.name}'s turn to choose</span>
          )}
          {gameState.type === 'WAITING_FOR_BUZZER' && mainTimer.timeLeft > 0 && (
            <span>Time remaining: {mainTimer.timeLeft}s</span>
          )}
          {gameState.type === 'PLAYER_ANSWERING' && (
            <span>{gameState.participant.name} is answering... ({answerTimer.timeLeft}s)</span>
          )}
        </div>
        
        {/* Score Display */}
        <div className="flex gap-4">
          {scores.map(score => (
            <div key={score.participantId} className="text-xl">
              {participants.find(p => p.participantId === score.participantId)?.name}: ${score.score}
            </div>
          ))}
        </div>
      </div>

      {/* Jeopardy Board */}
      {gameState.type === 'CATEGORY_SELECTION' && (
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
                    ${calculateQuestionValue(index)}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Question Display */}
      {(gameState.type === 'SHOWING_QUESTION' || gameState.type === 'WAITING_FOR_BUZZER' || gameState.type === 'PLAYER_ANSWERING') && selectedQuestion && (
        <div className="flex-1 flex flex-col items-center justify-center text-4xl">
          <div className="mb-8">
            {slide.categories.find(c => c.id === selectedQuestion.categoryId)
              ?.questions[selectedQuestion.questionIndex].question}
          </div>
          {gameState.type === 'SHOWING_QUESTION' && (
            <Button size="lg" onClick={startBuzzerPhase}>Start</Button>
          )}
        </div>
      )}

      {/* Buzzer Phase */}
      {gameState.type === 'WAITING_FOR_BUZZER' && (
        <div className="fixed bottom-4 left-4 right-4 flex justify-center gap-4">
          {participants.map(participant => (
            <Button
              key={participant.participantId}
              size="lg"
              onClick={() => handleBuzzer(participant)}
            >
              {participant.name}
            </Button>
          ))}
        </div>
      )}

      {/* Player Answering */}
      {gameState.type === 'PLAYER_ANSWERING' && (
        <div className="fixed bottom-4 left-4 right-4 flex justify-center gap-4">
          <Button
            size="lg"
            variant="destructive"
            onClick={() => handleIncorrectAnswer(gameState.participant)}
          >
            Incorrect
          </Button>
          <Button
            size="lg"
            variant="default"
            onClick={() => handleCorrectAnswer(gameState.participant)}
          >
            Correct
          </Button>
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
          <div className="text-xl mt-4">(Click anywhere to continue)</div>
        </div>
      )}
    </div>
  );
} 