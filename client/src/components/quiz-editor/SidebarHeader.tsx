import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CustomTooltip } from '@/components/ui/custom-tooltip';
import { WrenchIcon, SaveIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarHeaderProps {
  quizName: string;
  onSettingsClick: () => void;
  onSaveClick: () => void;
  hasUnsavedChanges?: boolean;
  isSaving?: boolean;
}

export function SidebarHeader({
  quizName,
  onSettingsClick,
  onSaveClick,
  hasUnsavedChanges = false,
  isSaving = false,
}: SidebarHeaderProps) {
  return (
    <div className="p-3">
      <span className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-secondary-foreground">
            {quizName}
          </h2>
          {hasUnsavedChanges && (
            <span className="text-xs text-muted-foreground">
              (unsaved changes)
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <CustomTooltip content="Save Quiz">
            <Button
              size="sm"
              variant="ghost"
              className={cn(
                'aspect-square w-6 h-6',
                hasUnsavedChanges && 'text-primary hover:text-primary'
              )}
              onClick={onSaveClick}
              disabled={isSaving || !hasUnsavedChanges}
            >
              <SaveIcon className="w-4 h-4" />
            </Button>
          </CustomTooltip>
          <CustomTooltip content="Quiz Settings">
            <Button
              size="sm"
              variant="ghost"
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
