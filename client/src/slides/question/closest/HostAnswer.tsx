import { ClosestSlide, Participant } from '@/models/Quiz';
import NextSlide from '@/slides/_components/NextSlide';
import Avatar from '@/Avatar';
import { useTranslation } from 'react-i18next';
import { getParticipants } from '@/mock/participants';

interface HostAnswerProps {
  slide: ClosestSlide;
  participants: Participant[];
  onNextSlide: () => void;
}

const mockParticipants = getParticipants(10);

export function HostAnswer({ slide, participants = mockParticipants, onNextSlide }: HostAnswerProps) {
  const { t } = useTranslation(['questions']);

  // Calculate differences and sort participants by closest guess
  const participantsWithDiff = participants
    .map(participant => {
      const latestAnswer = participant.answers.at(-1)?.answer[0];
      const guess = latestAnswer ? parseFloat(latestAnswer) : null;
      const diff = guess !== null ? Math.abs(guess - slide.correctAnswer) : Infinity;
      return { participant, guess, diff };
    })
    .sort((a, b) => a.diff - b.diff);

  const winner = participantsWithDiff[0]?.participant;
  const hasValidGuesses = participantsWithDiff.some(p => p.guess !== null);

  return (
    <div className="flex flex-1">
      <div className="flex-1 flex flex-col items-center gap-12 justify-center">
        <h1 className="text-5xl font-display">{t('correctAnswer')}</h1>
        <h1 className="text-9xl font-display">{slide.correctAnswer}</h1>

        {hasValidGuesses && (
          <div className="flex flex-col gap-8 items-center">
            <div className="grid grid-cols-1 gap-4 w-full max-w-2xl">
              {participantsWithDiff.map(({ participant, guess, diff }, index) => (
                guess !== null && (
                  <div 
                    key={participant.participantId}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      index === 0 ? 'bg-green-500 text-white' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar
                        width="2.5rem"
                        height="2.5rem"
                        avatarString={participant.avatar}
                        collectionName={participant.collectionName}
                      />
                      <span className="text-2xl font-display">{participant.name}</span>
                    </div>
                    <div className="text-2xl font-display">
                      {guess} ({t('closest.difference')}: {diff.toFixed(2)})
                    </div>
                  </div>
                )
              ))}
            </div>

            {winner && (
              <div className="flex flex-col items-center gap-4">
                <span className="font-display text-center text-4xl">
                  {t('winner')}
                </span>
                <div className="flex flex-col items-center justify-center p-4 rounded-lg animate-[zoom-in_1s_ease-in-out]">
                  <Avatar
                    width="5rem"
                    height="5rem"
                    avatarString={winner.avatar}
                    collectionName={winner.collectionName}
                  />
                  <span className="text-5xl font-bold font-display mt-2">
                    {winner.name}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <NextSlide onClick={onNextSlide} />
    </div>
  );
} 