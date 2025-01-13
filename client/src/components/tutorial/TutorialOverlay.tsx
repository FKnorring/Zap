import { useEffect, useState } from 'react';
import { useTutorial } from '@/contexts/Tutorial/context';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TutorialOverlayProps {
  disabled?: boolean;
}

export function TutorialOverlay({ disabled }: TutorialOverlayProps) {
  if (disabled) return null;
  const { state, nextStep, skipTutorial } = useTutorial();
  const { activeStep, activeTutorial } = state;
  const { targetId } = activeStep || { targetId: null };
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [overlayStyle, setOverlayStyle] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!targetId || targetElement?.id === targetId) return;

    const intervalId = setInterval(() => {
      const element = document.getElementById(targetId);
      if (element) {
        setTargetElement(element);
        const rect = element.getBoundingClientRect();
        setOverlayStyle({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    }, 25);

    return () => clearInterval(intervalId);
  }, [targetId, targetElement]);

  useEffect(() => {
    if (!activeStep?.nextTrigger || !targetElement) return;

    const triggerElement = document.getElementById(activeStep.nextTrigger);
    if (triggerElement) {
      const handleTriggerClick = (e: MouseEvent) => {
        const originalClick = triggerElement.onclick;
        if (originalClick) {
          originalClick.call(triggerElement, e);
        }
        nextStep();
      };

      triggerElement.addEventListener('click', handleTriggerClick);
      return () => {
        triggerElement.removeEventListener('click', handleTriggerClick);
      };
    }
  }, [activeStep, targetElement, nextStep]);

  if (!activeStep || !activeTutorial) return null;

  return (
    <>
      {/* Highlight cutout */}
      {targetElement && (
        <div
          className="absolute z-50"
          style={{
            top: overlayStyle.top,
            left: overlayStyle.left,
            width: overlayStyle.width,
            height: overlayStyle.height,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)',
            borderRadius: '4px',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              pointerEvents: 'all',
              cursor: 'inherit',
            }}
            onClick={() => {
              const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
              });
              targetElement.dispatchEvent(clickEvent);
            }}
            onMouseEnter={() =>
              targetElement.dispatchEvent(new MouseEvent('mouseenter'))
            }
            onMouseLeave={() =>
              targetElement.dispatchEvent(new MouseEvent('mouseleave'))
            }
          />
        </div>
      )}

      {/* Tutorial dialog */}
      <Dialog open={true} modal={false} onOpenChange={() => {}}>
        <DialogContent
          overlay={false}
          className={cn(
            'text-black',
            'absolute z-50',
            activeStep.placement === 'top' &&
              'top-1/3 left-1/2 -translate-x-1/2',
            activeStep.placement === 'bottom' &&
              'top-2/3 left-1/2 -translate-x-1/2',
            activeStep.placement === 'left' &&
              'left-1/3 top-1/2 -translate-y-1/2',
            activeStep.placement === 'right' &&
              'left-2/3 top-1/2 -translate-y-1/2'
          )}
        >
          <DialogHeader>
            <DialogTitle>{activeStep.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">{activeStep.content}</div>
          <DialogFooter className="flex items-center">
            <Button variant="outline" onClick={skipTutorial}>
              Skip Tutorial
            </Button>
            {!activeStep.nextTrigger && (
              <Button onClick={nextStep}>
                {activeTutorial.steps[activeTutorial.steps.length - 1].id ===
                activeStep.id
                  ? 'Finish Tutorial'
                  : 'Next'}
              </Button>
            )}
            {activeStep.nextTrigger && (
              <span className="text-sm text-muted-foreground">
                Interact with the highlighted element to continue
              </span>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
