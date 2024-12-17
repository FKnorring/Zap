import { Tutorial } from '@/models/types/tutorial';

export const quizManagerTutorial: Tutorial = {
  id: 'quiz-manager-intro',
  name: 'Quiz Manager Introduction',
  startTriggerId: 'quiz-manager-container',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Zap!',
      content: 'Let me show you around and help you create your first quiz.',
      targetId: 'quiz-manager-container',
      placement: 'bottom',
    },
    {
      id: 'create-quiz',
      title: 'Create a Quiz',
      content: 'Click the "Create Quiz" button to get started.',
      targetId: 'create-quiz-button',
      nextTrigger: 'create-quiz-button',
      placement: 'right',
    },
    {
      id: 'create-quiz-input',
      title: 'Create a Quiz',
      content: 'Choose a name for your quiz and click "Create".',
      targetId: 'create-quiz-input',
      placement: 'right',
      nextTrigger: 'create-quiz-input',
    },
    {
      id: 'create-quiz-finish',
      title: 'You just created a quiz!',
      content:
        'To start it, click the "Start Quiz" button. You can also delete or share it by clicking "...". But lets edit this quiz, click anywhere on it to enter the editor!',
      targetId: 'first-quiz-card',
      placement: 'bottom',
    },
  ],
};

export const quizEditorTutorial: Tutorial = {
  id: 'quiz-editor-intro',
  name: 'Quiz Editor Introduction',
  startTriggerId: 'quiz-editor-container',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to the Quiz Editor!',
      content: 'Let me show you around and help you create your first quiz.',
      targetId: 'quiz-editor-container',
      placement: 'bottom',
    },
    {
      id: 'sidebar',
      title: 'Adding Slides',
      content:
        'Use the sidebar to add new slides to your quiz. Click the "Add Slide" button to get started.',
      targetId: 'slide-sidebar',
      placement: 'right',
      nextTrigger: 'add-slide-button',
    },
    {
      id: 'slide-types',
      title: 'Choose a Slide Type',
      content:
        'Select "Info Slide" to create your first slide. Info slides are great for introducing topics or providing context.',
      targetId: 'slide-type-menu',
      placement: 'right',
      nextTrigger: 'info-slide-button',
    },
    {
      id: 'editor',
      title: 'Slide Editor',
      content:
        'This is where you can edit your slide content. Try adding some text or images!',
      targetId: 'slide-editor',
      placement: 'left',
    },
    {
      id: 'toolbar',
      title: 'Slide Settings',
      content: 'Use the toolbar to customize your slide settings and styling.',
      targetId: 'slide-toolbar',
      placement: 'left',
    },
  ],
};

export const questionSlideTutorial: Tutorial = {
  id: 'question-slide',
  name: 'Creating Question Slides',
  startTriggerId: 'add-slide-button',
  steps: [
    {
      id: 'question-intro',
      title: 'Adding Questions',
      content: 'Let\'s create a question slide. Click the "Add Slide" button.',
      targetId: 'add-slide-button',
      placement: 'right',
      nextTrigger: 'add-slide-button',
    },
    {
      id: 'question-types',
      title: 'Question Types',
      content:
        'Choose from different question types like Multiple Choice, True/False, or Open Ended.',
      targetId: 'question-type-menu',
      placement: 'right',
    },
    {
      id: 'question-settings',
      title: 'Question Settings',
      content:
        'Configure time limits, points, and other question-specific settings here.',
      targetId: 'question-settings',
      placement: 'left',
    },
  ],
};

export const allTutorials = [
  quizManagerTutorial,
  quizEditorTutorial,
  questionSlideTutorial,
];
