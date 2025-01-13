export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  targetId: string; // ID of the element to highlight
  placement?: 'top' | 'bottom' | 'left' | 'right';
  nextTrigger?: string; // ID of the element that triggers the next step
  nextStepId?: string; // ID of the next step to show
  completed?: boolean;
}

export interface Tutorial {
  id: string;
  name: string;
  steps: TutorialStep[];
  startTriggerId: string; // ID of the element that starts this tutorial
  prerequisites?: string[]; // Array of tutorial IDs that must be completed before this one
  completed?: boolean;
}

export interface TutorialState {
  activeTutorial: Tutorial | null;
  activeStep: TutorialStep | null;
  queue: Tutorial[];
  completedTutorials: string[]; // Array of completed tutorial IDs
}

export interface TutorialContextType {
  state: TutorialState;
  startTutorial: (tutorial: Tutorial) => void;
  nextStep: () => void;
  completeTutorial: () => void;
  skipTutorial: () => void;
  addToQueue: (tutorial: Tutorial) => void;
  clearQueue: () => void;
}
