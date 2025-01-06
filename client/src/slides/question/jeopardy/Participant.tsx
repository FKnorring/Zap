import type { JeopardySlide, Participant } from '@/models/Quiz';
import { useTranslation } from 'react-i18next';
import { SquareTimer } from '@/components/ui/square-timer';
import { BuzzerButton } from '@/components/ui/buzzer-button';
import { useTimer } from '@/hooks';
import { useEffect } from 'react';

interface Props {
  slide: JeopardySlide;
  participantData: Participant;
  turn: string;
  answerTempQuestion: (answer: string) => boolean;
}

export function Participant({ slide, participantData, turn, answerTempQuestion }: Props) {
  const { t } = useTranslation('jeopardy');
  const { answerTimeLimit } = slide;

  const { start, stop, timeLeft, isRunning } = useTimer({
    duration: answerTimeLimit
  });

  if (!turn) return null;

  // Get the answering player's ID if someone is answering
  const answeringPlayerId = turn.startsWith('BUZZER_') ? turn.replace('BUZZER_', '') : null;

  // Start/stop timer when this player is answering
  useEffect(() => {
    const isAnswering = answeringPlayerId === participantData.participantId;
    if (isAnswering && !isRunning) {
      start();
    } else if (!isAnswering && isRunning) {
      stop();
    }
  }, [answeringPlayerId, start, stop, isRunning, participantData.participantId]);

  const renderContent = () => {
    // Board state - player's turn to select category
    if (turn === participantData.participantId) {
      return (
        <div className="text-4xl font-bold text-center mb-4">
          {t('participant.yourTurn')}
        </div>
      );
    }

    // Board state - waiting for another player to select
    if (turn.length === 36) { // UUID length for participantId
      return (
        <div className="text-4xl font-bold text-center mb-4">
          {t('participant.waitingForSelection')}
        </div>
      );
    }

    // Pre-buzzer state - waiting for host to read
    if (turn === 'PRE_BUZZER') {
      return (
        <BuzzerButton disabled>
          {t('participant.waitForHost')}
        </BuzzerButton>
      );
    }

    // Buzzer state - anyone can answer
    if (turn === 'BUZZER') {
      return (
        <BuzzerButton onClick={() => answerTempQuestion(participantData.participantId)}>
          {t('participant.answer')}
        </BuzzerButton>
      );
    }

    // Player answering state - show timer for answering player
    if (answeringPlayerId === participantData.participantId) {
      return (
        <div className="flex flex-col items-center gap-8 px-8">
          <div className="text-4xl font-bold text-center">
            {t('participant.yourAnswer', { timeLeft })}
          </div>
          <SquareTimer 
            progress={(timeLeft / answerTimeLimit) * 100} 
            className="scale-120"
          />
        </div>
      );
    }

    // Player answering state - show waiting message for other players
    if (answeringPlayerId && answeringPlayerId !== participantData.participantId) {
      return (
        <div className="text-4xl font-bold text-center mb-4">
          {t('participant.otherPlayerAnswering')}
        </div>
      );
    }

    // Post-question state
    if (turn === 'POST_QUESTION') {
      return (
        <div className="text-4xl font-bold text-center mb-4">
          {t('participant.waitForHostToProgress')}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center gap-4 p-4">
      {renderContent()}
    </div>
  );
} 