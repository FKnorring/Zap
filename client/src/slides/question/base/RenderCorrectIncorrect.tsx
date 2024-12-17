import { Participant } from '@/models/Quiz';
import { Check, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const inspirationalQuotes = [
  "Failure isn't the end—it's just the beginning. 💥",
  'Even the brightest minds stumble. Don’t be afraid to fail. 💡',
  'Mistakes aren’t failures, they’re fuel for your fire. 🔥',
  'Perseverance isn’t just about winning; it’s about proving them wrong. 😈',
  'One misstep won’t define you—your comeback will. 💪',
  'Success is built on the ruins of failure. Rise from the ashes. 🔥',
  'Falling is easy. Getting back up? That’s where you become unstoppable. ⚡',
  "You've got to get back to the grind-set mindset 😈",
  "You've got to LOCK-IN 🔒",
];

const partiallyCorrectQuotes = [
  "Almost there! You're on the right track. 🎯",
  "Not bad, but there's room for improvement! 📈",
  "You're getting warmer! Keep pushing! 🌡️",
  "Half right is better than all wrong! 💫",
];

const noStreakLost = ['At least you did not have a streak to loose! 🎉'];

export default function ParticipantCorrect({
  children,
  participant,
}: {
  children?: React.ReactNode;
  participant: Participant;
}) {
  const score = [...participant.score].reverse();
  const latestScore = score[0];
  
  const getAnswerState = () => {
    if (latestScore === 0) return 'incorrect';
    if (latestScore < 500) return 'partial';
    return 'correct';
  };

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
      title: 'Correct!',
      message: `Answer Streak: ${streak}`,
      quote: `+ ${latestScore}`,
    },
    partial: {
      bgColor: 'bg-yellow-500',
      icon: <AlertCircle width={70} height={70} />,
      title: 'Almost There!',
      message: `Answer Streak: ${streak}`,
      quote: partiallyCorrectQuotes[Math.floor(Math.random() * partiallyCorrectQuotes.length)],
    },
    incorrect: {
      bgColor: 'bg-red-500',
      icon: <X width={70} height={70} />,
      title: 'Wrong!',
      message: lostStreak === 0 ? '' : `Lost A Streak of ${lostStreak} 💀`,
      quote: lostStreak === 0
        ? noStreakLost[0]
        : inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)],
    },
  };

  const config = stateConfig[answerState];

  return (
    <div className={cn('flex flex-col items-center justify-center h-full pb-10', config.bgColor)}>
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
