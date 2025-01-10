import { Participant } from '@/models/Quiz';
import { Check, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface Props {
  children?: React.ReactNode;
  participant: Participant;
}

export default function ParticipantCorrect({ children, participant }: Props) {
  const { i18n, t } = useTranslation('participants');

  const resources = i18n.getResourceBundle(i18n.language, 'participants');
  // Gen random inspirational quote
  const inspQuotesObj = resources.insperationalQuotes || {};
  const inspKeys = Object.keys(inspQuotesObj);
  const randomKey = inspKeys[Math.floor(Math.random() * inspKeys.length)];
  const randomInspQuote = inspQuotesObj[randomKey];
  // Gen no streak lost message
  const noStreakLostObj = resources.noStreakLost || {};
  const noStreakKeys = Object.keys(noStreakLostObj);
  const randomNoStreakKey =
    noStreakKeys[Math.floor(Math.random() * noStreakKeys.length)];
  const noStreakMsg = noStreakLostObj[randomNoStreakKey];

  const score = [...participant.score].reverse();
  const latestScore = score[0] ?? 0;

  function getAnswerState() {
    if (latestScore === 0) return 'incorrect';
    if (latestScore < 500 && latestScore > 250) return 'partial';
    if (latestScore < 250) return 'bad';
    return 'correct';
  }

  const answerState = getAnswerState();

  let streak = 0;
  for (const s of score) {
    if (s === 0) break;
    streak += 1;
  }

  let lostStreak = 0;
  if (answerState === 'incorrect') {
    for (let i = 1; i < score.length; i++) {
      if (score[i] !== 0) {
        lostStreak += 1;
      } else {
        break;
      }
    }
  }

  const stateConfig = {
    correct: {
      bgColor: 'bg-green-500',
      icon: <Check width={70} height={70} />,
      title: t('correct'),
      message: `${t('answerStreak')} ${streak}`,
      quote: `+ ${latestScore}`,
    },
    partial: {
      bgColor: 'bg-yellow-500',
      icon: <AlertCircle width={70} height={70} />,
      title: t('almost'),
      message: `${t('answerStreak')} ${streak}`,
      quote: `+ ${latestScore}`,
    },
    bad: {
      bgColor: 'bg-orange-500',
      icon: <AlertCircle width={70} height={70} />,
      title: t('bad'),
      message: `${t('answerStreak')} ${streak}`,
      quote: `+ ${latestScore}`,
    },
    incorrect: {
      bgColor: 'bg-red-500',
      icon: <X width={70} height={70} />,
      title: t('wrong'),
      message: lostStreak === 0 ? '' : `${t('lostStreak')} ${lostStreak} 💀`,
      quote: lostStreak === 0 ? noStreakMsg : randomInspQuote,
    },
  };

  const config = stateConfig[answerState];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center h-full pb-10',
        config.bgColor
      )}
    >
      {children}
      <h1 className="text-3xl font-display text-center">{config.title}</h1>
      {config.icon}
      <p className="text-xl mt-0 font-display">{config.message}</p>
      <div className="text-xl bg-[#F4F3F2] w-[65%] text-black font-display rounded p-2 text-center mt-4">
        <h2>{config.quote}</h2>
      </div>
    </div>
  );
}
