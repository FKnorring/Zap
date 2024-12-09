import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { WrenchIcon } from "lucide-react";

interface SidebarHeaderProps {
  quizName: string;
  onSettingsClick: () => void;
}

export function SidebarHeader({
  quizName,
  onSettingsClick,
}: SidebarHeaderProps) {
  return (
    <div className="p-3">
      <span className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-bold text-secondary-foreground">
          {quizName}
        </h2>
        <div className="flex gap-2">
          <CustomTooltip content="Quiz Settings">
            <Button
              size="sm"
              className="aspect-square w-6 h-6"
              onClick={onSettingsClick}
            >
              <WrenchIcon className="w-4 h-4" />
            </Button>
          </CustomTooltip>
        </div>
      </span>
      <Separator className="mt-2" />
    </div>
  );
}
