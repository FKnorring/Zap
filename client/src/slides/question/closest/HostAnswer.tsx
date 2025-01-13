import { ClosestSlide, Participant } from '@/models/Quiz';
import NextSlide from '@/slides/_components/NextSlide';
import Avatar from '@/Avatar';
import { useTranslation } from 'react-i18next';
import { getParticipants } from '@/mock/participants';

interface HostAnswerProps {
  slide: ClosestSlide;
  participants: Participant[];
  onNextSlide: () => void;
  onPrevSlide: () => void;
  endQuiz: (quizCode: string) => Promise<boolean>;
  quizCode: string;
}

const mockParticipants = getParticipants(10);

export function HostAnswer({
  slide,
  participants = mockParticipants,
  onNextSlide,
  onPrevSlide,
  endQuiz,
  quizCode,
}: HostAnswerProps) {
  const { t } = useTranslation(['questions']);

  // Calculate differences and sort participants by closest guess
  const participantsWithDiff = participants
    .map((participant) => {
      const latestAnswer = participant.answers.at(-1)?.answer[0];
      const guess = latestAnswer ? parseFloat(latestAnswer) : null;
      const diff =
        guess !== null ? Math.abs(guess - slide.correctAnswer) : Infinity;
      return { participant, guess, diff };
    })
    .sort((a, b) => a.diff - b.diff);

  // Get top 4 closest and furthest participants
  const top4Closest = participantsWithDiff.slice(0, 4);
  const furthest =
    participantsWithDiff.length > 0
      ? participantsWithDiff[participantsWithDiff.length - 1]
      : null;

  const hasValidGuesses = participantsWithDiff.some((p) => p.guess !== null);

  // Determine the max width for consistent spacing
  const maxGuessLength = Math.max(
    ...participantsWithDiff.map(({ guess }) =>
      guess ? guess.toString().length : 0
    )
  );
  const guessWidth = `${maxGuessLength + 1}ch`;

  return (
    <div className="flex flex-1">
      <div className="flex-1 flex flex-col items-center gap-4 justify-center">
        <h1 className="text-5xl font-display">{t('correctAnswer')}</h1>
        <h1 className="text-9xl font-display">{slide.correctAnswer}</h1>

        {hasValidGuesses && (
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
              {/* Display Top 4 Closest Participants */}
              {top4Closest.map(({ participant, guess, diff }, index) => (
                <div
                  key={participant.participantId}
                  className={`flex items-center justify-between p-6 rounded-lg ${
                    index === 0 ? 'bg-green-500 text-white' : 'bg-yellow-500'
                  }`}
                >
                  <div className="flex flex-row justify-center items-center gap-10 ">
                    {/* Guess Section with Fixed Width */}

                    {/* Participant Info */}
                    <div className="flex flex-col justify-center items-center gap-2">
                      <span className="text-2xl font-display text-center">
                        {participant.name}
                      </span>
                      <Avatar
                        width="4rem"
                        height="4rem"
                        avatarString={participant.avatar}
                        collectionName={participant.collectionName}
                      />
                      <h1
                        className="text-4xl font-display text-center"
                        style={{ width: guessWidth }}
                      >
                        {guess}
                      </h1>
                    </div>

                    <div className="flex flex-col justify-center text-center text-2xl font-display">
                      {index === 0 && (
                        <span className="mb-4">{t('closest.closest')}</span>
                      )}
                      {index === 1 && (
                        <span className="mb-4">{t('closest.2nd')}</span>
                      )}
                      {index === 2 && (
                        <span className="mb-4">{t('closest.3rd')}</span>
                      )}
                      {index > 2 && <span className="mb-4">{index + 1}</span>}

                      <span>{t('closest.difference')}</span>
                      <span>{diff.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Display Furthest Participant */}
              {furthest && furthest.guess !== null && (
                <div className="flex items-center justify-between p-6 rounded-lg bg-red-500 text-white">
                  <div className="flex flex-row justify-center items-center gap-10">
                    {/* Participant Info */}
                    <div className="flex flex-col justify-center items-center gap-2">
                      <span className="text-2xl font-display text-center">
                        {furthest.participant.name}
                      </span>
                      <Avatar
                        width="4rem"
                        height="4rem"
                        avatarString={furthest.participant.avatar}
                        collectionName={furthest.participant.collectionName}
                      />
                      <h1
                        className="text-4xl font-display text-center"
                        style={{ width: guessWidth }}
                      >
                        {furthest.guess}
                      </h1>
                    </div>

                    <div className="flex flex-col justify-center text-center text-2xl font-display">
                    <span className="mb-4">{t('closest.last')}</span>
                      {/* Adjust this number as needed */}
                      <span>{t('closest.difference')}</span>
                      <span>{furthest.diff.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <NextSlide
        quizCode={quizCode}
        endQuiz={() => endQuiz(quizCode)}
        onPrev={onPrevSlide}
        onNext={onNextSlide}
      />
    </div>
  );
}
