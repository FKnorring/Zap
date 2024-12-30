import { cn } from '@/lib/utils';
import type { JeopardySlide, Participant } from '@/models/Quiz';
import { useTranslation } from 'react-i18next';
import { SquareTimer } from '@/components/ui/square-timer';
import { useTimer } from '@/hooks';
import { useEffect } from 'react';

interface Props {
  slide: JeopardySlide;
  participantData: Participant;
  isTurn: string;
  answerTempQuestion: (answer: string) => boolean;
}

function BuzzerButton({ disabled, onClick }: { disabled: boolean, onClick: () => void }) {
  const { t } = useTranslation('jeopardy');
  return (
    <button
      className={cn(
        'text-white p-2 rounded-full w-[50vw] aspect-square relative',
        'transform transition-transform active:scale-95',
        'shadow-[inset_0px_-8px_20px_rgba(0,0,0,0.3)]',
        disabled ? (
          'bg-gradient-to-b from-gray-400 to-gray-600 shadow-gray-700'
        ) : (
          [
          'bg-gradient-to-b from-green-400 to-green-600',
          'hover:from-green-300 hover:to-green-500',
          'shadow-[0_10px_30px_-10px_rgba(34,197,94,0.5)]',
          'before:absolute before:inset-[3%] before:rounded-full',
          'before:bg-gradient-to-b before:from-green-300/80 before:to-transparent',
          'before:pointer-events-none'
          ].join(' ')
        )
      )}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="relative z-10 text-xl font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
        {disabled ? t('participant.waitForHost') : t('participant.answer')}
      </span>
    </button>
  )
}

export function Participant({ slide, participantData, isTurn, answerTempQuestion }: Props) {
  const { t } = useTranslation('jeopardy');

  const { answerTimeLimit } = slide;

  const { start, stop, timeLeft, isRunning } = useTimer({
    duration: answerTimeLimit
  });

  if (!isTurn) return null;

  const isMyTurn = isTurn === participantData.participantId;

  const isBuzzerOn = isTurn === "PRE_BUZZER" || isTurn === "BUZZER" || isTurn?.startsWith("BUZZER_");

  const isPreBuzzer = isTurn === "PRE_BUZZER";

  const playerAnswering = isTurn?.startsWith("BUZZER_");

  const isMyBuzzerTurn = isBuzzerOn && isTurn?.endsWith(participantData.participantId);

  const isAnswering = isMyBuzzerTurn && playerAnswering

  useEffect(() => {
    if (isAnswering && !isRunning) {
      start();
    } else if (!isAnswering && isRunning) {
      stop();
    }
  }, [isAnswering, start, stop]);

  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center gap-4 p-4">
      {/* If it is time to select a category */}
      {!isBuzzerOn && (
        isMyTurn ?
          <div className="text-xl font-bold text-green-500 mb-4">
            {t('participant.yourTurn')}
          </div>
          :
          <div className="text-xl font-bold text-green-500 mb-4">
            {t('participant.waitingForSelection')}
          </div>
      )}

      {/* If it is time to answer a question */}
      {isBuzzerOn && !isAnswering && (
        <BuzzerButton disabled={isPreBuzzer || (playerAnswering && !isMyBuzzerTurn)} onClick={() => answerTempQuestion('')} />
      )}

      {/* If this player is currently answering */}
      {isAnswering && (
        <div className="flex flex-col items-center gap-8 px-8">
          <div className="text-4xl font-bold">
            {t('participant.yourAnswer')}
          </div>
          <SquareTimer 
            progress={(timeLeft / answerTimeLimit) * 100} 
            className="scale-120"
          />
        </div>
      )}
    </div>
  );
} 