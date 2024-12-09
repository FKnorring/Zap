import { useState } from "react";
import { FTASlide, Participant } from "@/models/Quiz";
import { Button } from "@/components/ui/button";
import Avatar, { genConfig } from "react-nice-avatar";
import { stringSimilarity } from "string-similarity-js";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

export function HostAnswer({
  slide,
  participants = [],
  handleAddPoints,
}: {
  slide: FTASlide;
  participants: Participant[];
  handleAddPoints: (
    pointsData: { participantId: string; awardPoints: number }[],
    changeSlide: boolean,
  ) => void;
}) {
  const [latestAnswers, setLatestAnswers] = useState(() =>
    participants.map((participant) => {
      const latestAnswer =
        participant.answers.length > 0
          ? participant.answers[participant.answers.length - 1].answer
          : "??";
      const similarity = stringSimilarity(latestAnswer[0], slide.correctAnswer);
      return {
        name: participant.name,
        avatar: participant.avatar,
        id: participant.participantId,
        answer: latestAnswer,
        similarity: similarity * 100,
        points: similarity >= 98 ? slide.points : 0,
      };
    }),
  );

  const togglePoints = (participantId: string) => {
    setLatestAnswers((prevAnswers) =>
      prevAnswers.map((entry) =>
        entry.id === participantId
          ? { ...entry, points: entry.points === 0 ? slide.points : 0 }
          : entry,
      ),
    );
  };

  async function handleAwardPointsNextSlide() {
    handleAddPoints(
      latestAnswers.map((entry) => ({
        participantId: entry.id,
        awardPoints: entry.points,
      })),
      true,
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Slide Title */}
      <div className="bg-white rounded p-4 mb-10 mt-20 text-wrap text-center">
        <h1 className="text-4xl text-black font-display">
          Correct Answer:{" "}
          <span className="bg-green-500 text-white px-2 py-1 rounded">
            {slide.correctAnswer}
          </span>
        </h1>
      </div>

      {/* Display Participants' Latest Answers */}
      <div className="flex flex-wrap gap-4 justify-center">
        {latestAnswers.map((entry, index) => (
          <div
            key={index}
            className="bg-white rounded p-4 flex flex-col items-center shadow-md space-y-3"
          >
            <div className="flex items-center">
              <Avatar
                style={{ width: "2rem", height: "2rem" }}
                {...genConfig(entry.avatar)}
              />
              <h1 className="text-2xl font-display text-black pl-1">
                {entry.name}
              </h1>
            </div>
            <div className="w-full text-center">
              <h1
                className="font-display text-gray-600 pl-1"
                style={{
                  fontSize: `${Math.max(2 - entry.answer.length / 1, 2)}rem`, // Dynamically adjust font size
                }}
              >
                {entry.answer}
              </h1>
            </div>

            <div
              className={cn("flex items-center space-x-2 p-2 rounded-md", {
                "bg-green-500 text-white": entry.points,
                "bg-white text-black ": !entry.points,
              })}
            >
              <Label
                htmlFor={entry.id}
                className="cursor-pointer font-display text-xl"
              >
                Award points
              </Label>
              <Checkbox
                id={entry.id}
                checked={entry.points !== 0}
                onCheckedChange={() => togglePoints(entry.id)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Next Slide Button */}
      <Button
        onClick={handleAwardPointsNextSlide}
        className="absolute bottom-5 right-5"
      >
        Award points & Next Slide
      </Button>
    </div>
  );
}
