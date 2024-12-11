import { Participant } from '@/models/Quiz';
import { Check, X } from 'lucide-react';

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

const noStreakLost = ['At least you did not have a streak to loose! 🎉'];

export default function ParticipantCorrect({
  participant,
}: {
  participant: Participant;
}) {
  // Calculate answer streak and reverse score
  const score = [...participant.score].reverse();

  // Latest question was answered wrong.
  if (score[0] === 0) {
    let lostStreak = 0;

    for (let i = 1; i < score.length; i++) {
      const s = score[i];
      if (s !== 0) {
        lostStreak += 1;
      } else {
        break;
      }
    }

    const randomQuote =
      lostStreak === 0
        ? noStreakLost[Math.floor(Math.random() * noStreakLost.length)]
        : inspirationalQuotes[
            Math.floor(Math.random() * inspirationalQuotes.length)
          ];

    return (
      <div className="flex flex-col items-center justify-center bg-red-500 h-full">
        <h1 className="text-3xl font-display text-center">Wrong!</h1>
        <X width={70} height={70} />
        <p className="text-xl mt-0 font-display">
          {lostStreak === 0
            ? `Lost A Streak of ${lostStreak}`
            : `Lost A Streak of ${lostStreak} 💀`}
        </p>
        <div className="text-xl bg-[#F4F3F2] w-[65%] text-black font-display rounded p-2 text-center mt-4">
          <h2>{randomQuote}</h2>
        </div>
      </div>
    );
  }

  let answerStreak = 0;
  for (const s of score) {
    if (s === 0) break;
    answerStreak += 1;
  }

  // Latest question was answered correctly
  return (
    <div className="flex flex-col items-center justify-center h-full bg-green-500">
      <h1 className="text-3xl font-display text-center">Correct!</h1>
      <Check width={70} height={70} />
      <p className="text-xl mt-0 font-display">Answer Streak: {answerStreak}</p>
      <div className="text-xl bg-[#F4F3F2] w-[60%] text-black font-display rounded p-2 text-center mt-4">
        <h2>+ {score[0]}</h2>
      </div>
    </div>
  );
}
