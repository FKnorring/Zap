import { InfoSlide } from "@/models/Quiz";

interface InfoViewProps {
  slide: InfoSlide;
}

export default function InfoView({ slide }: InfoViewProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full pt-80">
      <h1 className="text-3xl font-display text-center">{slide.title}</h1>
    </div>
  );
}
