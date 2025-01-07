import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CustomTooltip } from '@/components/ui/custom-tooltip';
import { WrenchIcon, SaveIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSlideSidebarContext } from './SlideSidebarContext';

export function SidebarHeader() {
  const {
    quizName,
    onSettingsClick,
    onSaveClick,
    hasUnsavedChanges = false,
    isSaving = false,
  } = useSlideSidebarContext();

  return (
    <div className="p-3">
      <span className="flex items-center justify-between gap-2">
        <div className="relative flex items-center gap-2">
          <h2 className="text-xl font-display text-secondary-foreground">
            {quizName}
          </h2>
          {hasUnsavedChanges && (
            <span className=" top-6 text-md font-bold text-muted-foreground text-red-600">
              (Unsaved changes)
            </span>
          )}
        </div>
        <div className="flex gap-2 text-black">
          <CustomTooltip content="Save Quiz">
            <Button
              size="sm"
              variant="outline"
              className={cn(
                'aspect-square w-8 h-8',
                hasUnsavedChanges && 'text-primary hover:text-primary'
              )}
              onClick={onSaveClick}
              disabled={isSaving || !hasUnsavedChanges}
            >
              <SaveIcon className="w-6 h-6" />
            </Button>
          </CustomTooltip>
          <CustomTooltip content="Quiz Settings">
            <Button
              size="icon"
              variant="outline"
              className="aspect-square w-8 h-8"
              onClick={onSettingsClick}
            >
              <WrenchIcon className="w-6 h-6" />
            </Button>
          </CustomTooltip>
        </div>
      </span>
      <Separator className="mt-2" />
    </div>
  );
}
