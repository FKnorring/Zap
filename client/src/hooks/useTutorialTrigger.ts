import { useCallback, useEffect } from 'react';
import { useTutorial } from '@/contexts/Tutorial/context';
import { allTutorials } from '@/data/tutorials';
import { useAppContext } from '@/contexts/App/context';

export function useTutorialTrigger() {
  const {
    user: { user },
  } = useAppContext();
  const { startTutorial, state } = useTutorial();

  const startTriggers = allTutorials.map((tutorial) => tutorial.startTriggerId);

  const attachTutorialListener = useCallback(
    (triggerId: string) => {
      const element = document.getElementById(triggerId);
      if (element) {
        const tutorial = allTutorials.find(
          (tutorial) => tutorial.startTriggerId === triggerId
        );

        // Only start the tutorial if it exists and hasn't been completed
        if (tutorial && !state.completedTutorials.includes(tutorial.id)) {
          startTutorial(tutorial);
        }
      }
    },
    [startTutorial, state.completedTutorials]
  );

  useEffect(() => {
    if (state.activeTutorial) return;
    if (!user || user?.tutorialsDisabled) return;
    // Create a MutationObserver to watch for DOM changes
    const observer = new MutationObserver(() => {
      startTriggers.forEach((triggerId) => {
        attachTutorialListener(triggerId);
      });
    });

    // Initial check for elements
    startTriggers.forEach((triggerId) => {
      attachTutorialListener(triggerId);
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup function
    return () => {
      observer.disconnect();
      // Remove event listeners if needed
      startTriggers.forEach((triggerId) => {
        const element = document.getElementById(triggerId);
        if (element) {
          element.removeEventListener('click', () => {
            const tutorial = allTutorials.find(
              (tutorial) => tutorial.startTriggerId === triggerId
            );
            if (tutorial && !state.completedTutorials.includes(tutorial.id)) {
              startTutorial(tutorial);
            }
          });
        }
      });
    };
  }, [
    startTriggers,
    attachTutorialListener,
    state.completedTutorials,
    user?.tutorialsDisabled,
  ]);
}
