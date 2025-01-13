import { FASlide, Participant } from '@/models/Quiz';
import NextSlide from '@/slides/_components/NextSlide';
import { useTranslation } from 'react-i18next';
import Avatar from '@/Avatar';

export function HostAnswer({
  slide,
  participants,
  onNextSlide,
  onPrevSlide,
  endQuiz,
  quizCode,
}: {
  slide: FASlide;
  participants: Participant[];
  onNextSlide: () => void;
  onPrevSlide: () => void;
  endQuiz: (quizCode: string) => Promise<boolean>;
  quizCode: string;
}) {
  var winner;
  if (participants) {
    winner = participants.find((participant) => {
      if (participant.score.length > 0) {
        const lastScore = participant.score[participant.score.length - 1]; // Get the last score
        return lastScore !== 0; // Check if it's not 0
      }
    });
  }

  const { t } = useTranslation(['questions']);
  return (
    <div className="flex flex-1">
      <div className="flex-1 flex flex-col items-center gap-28 justify-center">
        <h1 className="text-5xl font-display">{t('correctAnswer')} ...</h1>
        {slide.correctAnswer == '' ? (
          <span className="text-9xl font-display">
            {t('presentedByTheHost')}
          </span>
        ) : (
          <h1 className="text-9xl font-display">{slide.correctAnswer}</h1>
        )}
        {winner && (
          <div className="flex flex-col gap-6 mt-20">
            <span className="font-display text-center text-6xl">
              {t('winner')}
            </span>
            <div className="flex flex-col items-center justify-center p-4 rounded-lg animate-[zoom-in_1s_ease-in-out] ">
              <Avatar
                avatarString={winner.avatar}
                collectionName={winner.collectionName}
              ></Avatar>
              <span className={'text-5xl font-bold font-display'}>
                {winner.name}
              </span>
            </div>
          </div>
        )}
      </div>

      <NextSlide
        quizCode={quizCode}
        endQuiz={() => endQuiz(quizCode)} // Corrected here
        onPrev={onPrevSlide}
        onNext={onNextSlide}
      />
    </div>
  );
}
