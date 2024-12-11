import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { StopCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PlayButton({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation();
  return (
    <CustomTooltip content={t('slides:endQuiz')}>
      <button
        onClick={onClick}
        className="relative border-2 border-destructive p-2 text-4xl bg-destructive text-background transition-colors hover:bg-destructive/10 hover:text-destructive flex items-center gap-2 rounded-l-full"
      >
        <StopCircle strokeWidth={3} className="pl-1 w-10 h-10" />
      </button>
    </CustomTooltip>
  );
}
