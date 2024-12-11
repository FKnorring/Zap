import { cn } from "@/lib/utils";
import { Play } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PlayButton({ onClick, disabled }: { onClick: () => void, disabled: boolean }) {
  const { t } = useTranslation();
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={
        cn("relative border-2 border-primary px-6 py-2 text-4xl bg-primary text-background transition-colors flex items-center gap-2 rounded-r-full",
          !disabled && "hover:bg-primary/10 hover:text-primary",
          disabled && "border-gray-500 bg-gray-500 text-gray-300 cursor-not-allowed")
      }
    >
      
      <span className="block h-10 overflow-hidden font-display" aria-hidden>
        {t('slides:startQuiz')}
      </span>
      <Play strokeWidth={3} className="w-8 h-8" />
    </button>
  );
}
