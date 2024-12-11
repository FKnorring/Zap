import { cn } from "@/lib/utils";
import { Play } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NextSlide({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      className={
        cn(
          "absolute bottom-5 right-5",
          "border-2 border-primary px-6 py-2 text-4xl",
          "bg-primary text-background transition-colors flex items-center gap-2 rounded-full",
          "hover:bg-primary/10 hover:text-primary"
        )
      }
    >
      <span className="block h-10 overflow-hidden font-display" aria-hidden>
        {t('general:nextSlide')}
      </span>
      <Play strokeWidth={3} className="w-8 h-8" />
    </button>
  );
}
