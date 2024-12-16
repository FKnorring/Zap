import { ParticipantAnswer } from '@/models/Quiz';
import { useState, useEffect } from 'react';

// Main SlideRank component
export function SlideRank({
  ranking,
  answers,
}: {
  ranking: string[];
  answers: ParticipantAnswer[];
}) {
  const [currentRanking, setCurrentRanking] = useState<string[]>(ranking || []);

  // Randomize the ranking on the first render
  useEffect(() => {
    const randomizedRanking = [...(ranking || [])];
    setCurrentRanking(randomizedRanking); // Update state with randomized ranking
  }, [ranking]);

  const correctnessCount: Record<string, number> = {};
  currentRanking.forEach((option, index) => {
    correctnessCount[option] = 0; // Initialize the count for each option

    if (answers) {
      answers.forEach(({ answer }) => {
        if (answer[index] === option) {
          correctnessCount[option]++; // Increment count if the participant's answer matches
        }
      });
    }
  });

  console.log('dew', correctnessCount['First']);

  return (
    <div className="flex  w-full items-center justify-center">
      <div className="w-full max-w-xl flex flex-col items-center space-y-4">
        {/* Display ranking names vertically with numbers */}
        <div className="flex flex-col w-full space-y-3 pb-5">
          {currentRanking.map((text, index) => (
            <div key={index} className="flex items-center w-full space-x-4">
              {/* Display the index with proper alignment */}
              <h2 className="font-display text-6xl font-bold text-center text-[#F4F3F2] w-10">
                {index + 1}
              </h2>
              <div className="flex items-center w-full p-4 rounded-lg bg-[#F4F3F2] text-4xl font-display text-[#333333] justify-between">
                <span className="text-left">{text}</span>
                <span className="text-right">
                  {correctnessCount[text]} / {answers ? answers.length : 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SlideRank;
