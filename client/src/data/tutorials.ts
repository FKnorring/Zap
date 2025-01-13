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
      targetId: 'quiz-sidebar',
      placement: 'right',
    },
    {
      id: 'editor',
      title: 'Slide Preview',
      content:
        'This is where you can preview your slide content. Try adding some text or images!',
      targetId: 'quiz-preview',
      placement: 'bottom',
    },
    {
      id: 'toolbar',
      title: 'Slide Settings',
      content: 'Use the toolbar to customize your slide settings and styling.',
      targetId: 'quiz-toolbar',
      placement: 'left',
    },
  ],
};

export const firstSlideTutorial: Tutorial = {
  id: 'first-slide-tutorial',
  prerequisites: ['quiz-editor-intro'],
  name: 'Editing your first slide',
  startTriggerId: 'title-input',
  steps: [
    {
      id: 'edit-intro',
      title: 'Editing your first slide',
      content:
        "Let's edit your first slide. Were going to start with the most simple settings.",
      targetId: 'quiz-toolbar',
      placement: 'right',
    },
    {
      id: 'title-input',
      title: 'Title',
      content: 'Enter a title for your slide.',
      targetId: 'title-input',
      placement: 'right',
    },
    {
      id: 'content-input',
      title: 'Content',
      content: 'Enter some content for your slide.',
      targetId: 'content-input',
      placement: 'left',
    },
    {
      id: 'image-input',
      title: 'Image',
      content: 'Add an image to your slide.',
      targetId: 'image-input',
      placement: 'left',
    },
  ],
};

export const allTutorials = [
  quizManagerTutorial,
  quizEditorTutorial,
  firstSlideTutorial,
];
