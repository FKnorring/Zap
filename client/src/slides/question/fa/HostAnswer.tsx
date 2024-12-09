import { Button } from "@/components/ui/button";
import { FASlide } from "@/models/Quiz";
import { useTranslation } from "react-i18next";

export function HostAnswer({
  slide,
  onNextSlide,
}: {
  slide: FASlide;
  onNextSlide: () => void;
}) {
  const { t } = useTranslation(["questions"]);
  return (
    <div>
      <div className="flex flex-col items-center gap-28">
        <h1 className="text-5xl font-display">{t("correctAnswer")} ...</h1>
        <h1 className="text-9xl font-display">{slide.correctAnswer}</h1>
      </div>

      <Button onClick={onNextSlide} className="absolute bottom-5 right-5">
        Next Slide
      </Button>
    </div>
  );
}
