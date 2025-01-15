# Zap!

**Zap!** is a web application that allows users to create and host interactive quiz and game nights. Designed for versatility and engagement, it combines the functionality of presentation tools with dynamic game mechanics. Hosts can create customized slides, manage game sessions, and provide players with a seamless, engaging experience.

---

## Table of Contents

- [User Guide](#user-guide)
  - [Features](#features)
  - [Getting Started](#getting-started)
  - [Hosting a Game](#hosting-a-game)
  - [Playing a Game](#playing-a-game)
- [Developer Guide](#developer-guide)
  - [Technologies and Services](#technologies-and-services)
  - [Setup](#setup)
  - [Code Structure](#code-structure)
  - [Development Guide](#development-guide)
  - [Internationalization](#internationalization)
  - [Configuration Structure](#configuration-structure)
- [Contributors](#contributors)

---

## User Guide

### Features

Zap! supports the creation of quizzes with various slide types:

#### Presentation Slides
- **Information Slide**: Presents information to players without interaction
- **Bullet Points**: Displays a list of bullet points
- **Score Slide**: Displays the scores and rankings of players

#### Question Slides
- **Multiple Choice**: Single or multiple answers from a list of options
- **Too Close To Call**: Closest numerical answer wins
- **Ticking Time Bomb**: Turn-based answers with a timer
- **Fastest On The Buzzer**: First to buzz gets to answer
- **Free Text**: Open-ended text answers
- **Jeopardy**: Classic Jeopardy-style gameplay
- **LocateIt**: Map-based location finding
- **Meet Your Match**: Category matching challenge
- **Rank It Right**: Order-based ranking questions

### Getting Started

1. Visit [Zap's website](https://www.zap-quiz.com/)
2. Create an account or log in
3. Choose to host or join a game

### Hosting a Game

1. Click "Create New Quiz"
2. Add slides using the slide editor
3. Save your quiz
4. Start a game session
5. Share the room code with players

### Playing a Game

1. Visit the join game page
2. Enter the room code
3. Choose a nickname
4. Wait for the host to start

---

## Developer Guide

### Technologies and Services

- **TypeScript**: Primary programming language
- **React**: Frontend framework
- **shadcn**: UI component library
- **Firebase**: Backend and database solution
- **Vite**: Build tool
- **Kinde**: Authentication solution
- **Vercel**: Deployment solution

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/FKnorring/Zap.git
   cd Zap
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (see [Environment Variables](#environment-variables) below)
4. Start development server:
   ```bash
   npm run dev
   ```

#### Environment Variables
Using the `.env.example` file, you can copy its contents to a new `.env` file with the following command:
```bash
cp .env.example .env
```

Fill in the variables in your `.env` file:

```
# App Configuration
VITE_ENVIRONMENT=dev|prod              # Accepts variations like "dev", "development", "prod", "production"
VITE_PORT=5173                         # Optional: Development server port (default: 5173)
VITE_URI=https://your-domain.com/      # Optional: Production URI (ignored in dev environment)
VITE_BASE_URL=/                        # Optional: Base URL for the app (default: /)
VITE_ROUTER_BASE_NAME=                 # Optional: Router base name (default: "")
VITE_LOAD_PATH_i18=/locales/{{lng}}/{{ns}}.json  # Optional: i18n load path

# Kinde Authentication
VITE_KINDE_CLIENT_ID=your_client_id    # Your Kinde client ID (default provided)
VITE_KINDE_DOMAIN=your_kinde_domain    # Your Kinde domain (default provided)
VITE_KINDE_REDIRECT_URI=               # Optional: Override redirect URI (defaults to URI)
VITE_KINDE_LOGOUT_URI=                 # Optional: Override logout URI (defaults to URI)

# Firebase Configuration
VITE_FIREBASE_APIKEY=your_api_key
VITE_FIREBASE_AUTHDOMAIN=your_auth_domain
VITE_FIREBASE_PROJECTID=your_project_id
VITE_FIREBASE_STORAGEBUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGINGSENDERID=your_sender_id
VITE_FIREBASE_APPID=your_app_id
VITE_FIREBASE_DATABASEURL=your_database_url
VITE_FIREBASE_MEASUREMENTID=your_measurement_id
```

**Important Notes:**
- In development environment (`VITE_ENVIRONMENT=dev`), the URI will always be "http://localhost:5173" regardless of `VITE_URI`
- In production environment, if `VITE_URI` is not set, it defaults to "https://www.zap-quiz.com/"
- The environment variable accepts various formats (e.g., "dev", "DEV", "development", "DEVELOPMENT" for development)

### Code Structure

```plaintext
Zap/
├── src/
|   ├── config/      # Configuration files
│   ├── components/  # Reusable UI components
│   ├── hooks/       # Custom React hooks
│   ├── contexts/    # Contexts and context providers
│   ├── models/      # TypeScript interfaces and types
│   ├── pages/       # Route components
│   ├── routes/      # Navigation configuration
│   ├── services/    # API and utility services
│   ├── slides/      # Slide components and logic
│   ├── config/      # Configuration files
│   ├── utils/       # Utility functions
│   ├── i18n.ts      # Internationalization setup
│   ├── main.tsx     # Entry point
│   ├── App.tsx      # Main application component
│   ├── index.css    # Global styles
├── public/          # Public assets and locales
```

### Development Guide

#### Adding New Slide Types

1. Add type declaration in `/src/models/types/slides.ts`:
   ```typescript
   // Add to SlideTypes enum
   export enum SlideTypes {
     info = "info",
     score = "score",
     // your new slide type...
   }

   // Add your slide interface
   export interface YourNewSlide extends BaseSlide {
     type: SlideTypes.yourNewType;
     // additional properties...
   }

   // Update the Slide type union
   export type Slide = InfoSlide | ScoreSlide | ... | YourNewSlide;
   ```

2. Create directory in `/src/slides/[slide-type]` with:
   - `Preview.tsx`: Quiz editor preview
   - `Host.tsx`: Host view
   - `Participant.tsx`: Player view
   - `ParticipantAnswer.tsx`: Answer feedback view
   - `index.ts`: Component exports and metadata

3. Define slide metadata in `index.ts`:
   ```typescript
   import { SlideTypes } from '@/models/Quiz';
   import { YourIcon } from "lucide-react";
   import { SlideInfo } from '..';

   export const Info: SlideInfo = {
     value: "your-slide-name",
     icon: YourIcon,
     iconColor: "#hexcolor", // optional
     label: "Your Slide Label",
     slideType: SlideTypes.yourSlideType,
     interactivePreview: false, // optional
     defaults: {
       title: "Default Title",
       // other default properties...
     }
   } as const;
   ```

4. For question slides, implement score calculation:
   ```typescript
   interface QuestionSlideInfo<T extends QuestionSlide> extends SlideInfo {
     calculateScore: (slide: T, answer: string[]) => number;
   }
   ```

5. Update `/src/slides/index.ts`:
   ```typescript
   import * as YourSlide from './your-slide-type';
   
   // Add to exports
   export {
     Info,
     Score,
     // ...
     YourSlide,
   };
   ```

### Internationalization

#### Adding a New Language

1. Create translation files in `/public/locales/[language-code]/`:
   ```plaintext
   public/locales/
   ├── en/
   │   ├── general.json
   │   ├── quiz.json
   │   └── tutorial.json
   ├── sv/
   │   ├── general.json
   │   ├── quiz.json
   │   └── tutorial.json
   └── your-language/
       ├── general.json
       ├── quiz.json
       └── tutorial.json
   ```

2. Add translations to each JSON file. For example in `general.json`:
   ```json
   {
     "english": "English",
     "swedish": "Svenska",
     "chinese": "中文",
     "login": "Logga in",
     "your_language": "Your Language Name"
   }
   ```

3. Add language entry in `/src/config/languages.ts`:
   ```typescript
   export const languages = [
     {
       name: 'general:swedish',
       value: 'sv',
     },
     {
       name: 'general:english',
       value: 'en',
     },
     {
       name: 'general:chinese',
       value: 'cn',
     },
     // Add your new language here
     {
       name: 'general:your_language',
       value: 'language_code',
     },
   ];
   ```

#### Adding New Translations

1. Structure your translation files consistently across languages. Example structure:

   `quiz.json`:
   ```json
   {
     "create": {
       "title": "Create Quiz",
       "description": "Create a new interactive quiz",
       "button": "Create"
     },
     "join": {
       "title": "Join Quiz",
       "enterCode": "Enter room code",
       "button": "Join"
     }
   }
   ```

2. Use nested keys for better organization. Access them with dot notation:
   ```typescript
   import { useTranslation } from 'react-i18next';

   function Component() {
     const { t } = useTranslation('quiz');
     
     return (
       <button>
         {t('create.button')} {/* Renders text for "Create" button in currently set language */}
       </button>
     );
   }
   ```

3. Include placeholders using curly braces:
   ```json
   {
     "welcome": "Welcome, {{username}}!",
     "score": "You scored {{points}} points"
   }
   ```

   Usage:
   ```typescript
   t('welcome', { username: 'John' }) // "Welcome, John!"
   t('score', { points: 100 }) // "You scored 100 points"
   ```

4. Add the same keys to all language files to ensure full translation coverage.

Note: The `name` property in `languages.ts` should reference a translation key in the `general.json` files, and the `value` should be the ISO language code (e.g., 'en', 'sv', 'cn').

### Configuration Structure

The configuration is organized in a modular structure:

```plaintext
config/
├── core/
│   ├── environment.ts   # Environment detection and variables
│   ├── types.ts         # Configuration type definitions
│   └── uri.ts          # URI and base URL handling
├── features/
│   ├── flags.ts        # Feature flags
│   └── values.ts       # Global feature values
├── game/
│   ├── languages.ts    # Language configuration
│   └── limits.ts       # Game limits and maximums
├── services/
│   ├── firebase.ts     # Firebase configuration
│   └── kinde.ts        # Kinde authentication config
└── index.ts           # Main configuration export
```

#### Environment Variables

Environment variables are loaded with development-specific logging:

```typescript
// In development, missing variables are logged:
VITE_FIREBASE_APIKEY=missing
VITE_FIREBASE_DATABASEURL=missing

// Required variables will show validation errors:
Firebase configuration is missing required fields:
{
  apiKey: { status: 'missing', envVar: 'VITE_FIREBASE_APIKEY' },
  databaseUrl: { status: 'missing', envVar: 'VITE_FIREBASE_DATABASEURL' }
}
```

### Adding New Tutorials

Tutorials are defined in `/src/data/tutorials.ts` and follow a structured format for guiding users through the application.

1. Create a new tutorial object:
   ```typescript
   const yourTutorial: Tutorial = {
     id: 'unique-tutorial-id',
     name: 'Tutorial Display Name',
     startTriggerId: 'element-id',
     prerequisites: ['tutorial-id-1', 'tutorial-id-2'], // optional
     steps: [
       {
         id: 'step-1',
         title: 'Step Title',
         content: 'Step instructions or information',
         targetId: 'target-element-id',
         placement: 'bottom', // 'top' | 'bottom' | 'left' | 'right'
         nextTrigger: 'next-element-id', // optional
       },
       // more steps...
     ],
   };
   ```

2. Add your tutorial to `allTutorials` array:
   ```typescript
   export const allTutorials = [
     quizManagerTutorial,
     quizEditorTutorial,
     yourTutorial,
   ];
   ```

#### Tutorial Configuration Parameters

- **prerequisites**: (optional) Array of tutorial IDs that must be completed before this tutorial can start
  ```typescript
  prerequisites: ['quiz-editor-intro', 'first-slide-tutorial']
  ```

- **startTriggerId**: ID of the element that must be rendered to trigger the tutorial
  ```typescript
  // Tutorial will only start when an element with id="quiz-editor" is present
  startTriggerId: 'quiz-editor'
  ```

- **targetId**: ID of the element to highlight during the tutorial step
  ```typescript
  // The element with id="create-button" will be highlighted
  targetId: 'create-button'
  ```

- **nextTrigger**: (optional) Forces user interaction with specified element to proceed
  ```typescript
  // User must interact with the element with id="save-button" to continue
  nextTrigger: 'save-button'
  ```

Example tutorial with all features:
```typescript
export const editorTutorial: Tutorial = {
  id: 'editor-tutorial',
  name: 'Quiz Editor Tutorial',
  startTriggerId: 'quiz-editor',
  prerequisites: ['basic-tutorial'],
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to the Editor',
      content: 'Click the Create button to start.',
      targetId: 'create-button',
      placement: 'bottom',
      nextTrigger: 'create-button', // User must click the create button
    },
    {
      id: 'edit-title',
      title: 'Enter a Title',
      content: 'Type your quiz title here.',
      targetId: 'title-input',
      placement: 'right',
      // No nextTrigger - automatically proceeds
    },
  ],
};
```

**Important Notes:**
- Elements referenced by `targetId` and `nextTrigger` must exist in the DOM
- Use consistent ID naming across your components
- Consider mobile responsiveness when choosing `placement`
- Keep tutorial steps concise and focused

---

## Contributors

- [Jacob Dillström](https://www.linkedin.com/in/jacob-dillstrom/) ([GitHub](https://github.com/Dillenzz))
- [Elisabet Hansson](https://www.linkedin.com/in/lisa-hansson/) ([GitHub](https://github.com/eliha458))
- [Filip von Knorring](https://www.linkedin.com/in/filip-v-4b9976139/) ([GitHub](https://github.com/FKnorring))
- [Nils Persson](https://www.linkedin.com/in/nils-albin-persson/) ([GitHub](https://github.com/NilssPersson))
- [Ramez Shakarna](https://www.linkedin.com/in/ramezshakarna/) ([GitHub](https://github.com/ramezio))
