import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClosestSlide } from "@/models/Quiz";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ClosestViewProps {
  slide: ClosestSlide;
  answerQuestion: (answer: string[]) => void;
}

export function Participant({ slide, answerQuestion }: ClosestViewProps) {
  const [value, setValue] = useState("");
  const { t } = useTranslation(["questions"]);

  const handleSubmit = () => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      answerQuestion([value]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-5 m-4 rounded-md h-full">
      <div className="flex flex-col items-center justify-center p-8 space-y-5 bg-white rounded-lg">
        <h1 className="text-3xl font-display text-center text-[#333333]">
          {slide.title}
        </h1>
        <Input
          type="number"
          placeholder={t("closest.enterGuess")}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="font-display text-3xl text-[#333333] bg-[#F4F3F2]"
        />

        <Button 
          onClick={handleSubmit}
          disabled={value === "" || isNaN(parseFloat(value))}
        >
          {t("closest.submitGuess")}
        </Button>
      </div>
    </div>
  );
} 