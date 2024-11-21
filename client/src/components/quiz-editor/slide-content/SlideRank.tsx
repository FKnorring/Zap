import { useState, useEffect } from "react";

// Main SlideRank component
export function SlideRank({ ranking }: { ranking: string[] }) {
  const [currentRanking, setCurrentRanking] = useState<string[]>(ranking || []);

  // Randomize the ranking on the first render
  useEffect(() => {
    const randomizedRanking = [...(ranking || [])];
    setCurrentRanking(randomizedRanking); // Update state with randomized ranking
  }, [ranking]);

  return (
    <div className="flex  w-full items-center justify-center">
      <div className="w-full max-w-xl flex flex-col items-center space-y-4">
        {/* Display ranking names vertically with numbers */}
        {currentRanking.map((name, index) => (
          <div
            key={index}
            className="text-textonwbg-grayonw bg-component-background p-5 text-5xl font-bold text-center rounded-lg shadow-md w-full flex items-center"
          >
            <span className="mr-4 text-5xl">{index + 1}.</span>
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SlideRank;
