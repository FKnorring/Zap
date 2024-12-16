import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function EndQuizButton({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="absolute top-5 left-0">
      <CustomTooltip content={t('slides:endQuiz')}>
        <button
          onClick={onClick}
          className="relative border-2 border-destructive p-2 text-4xl bg-destructive text-background transition-colors hover:bg-destructive/10 hover:text-destructive flex items-center gap-2 rounded-r-full"
        >
          <X strokeWidth={3} className="pr-1 w-10 h-10" />
        </button>
      </CustomTooltip>
    </div>
  );
}
