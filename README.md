# Zap!

**Zap!** is a web application that allows users to create and host interactive quiz and game nights. Designed for versatility and engagement, it combines the functionality of presentation tools with dynamic game mechanics. Hosts can create customized slides, manage game sessions, and provide players with a seamless, engaging experience.

---

## Table of Contents

- [Features](#features)
- [Slide Types](#slide-types)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Code Structure](#code-structure)
- [Developer Documentation](#developer-documentation)
- [Contributors](#contributors)

---

## Features

### Slide Types

Zap! supports the creation of quizzes with the following slide types:

1. **Presentation Slides**
   - Slides that are used to present information to the participants
      - **Information Slide**: Presents information to players without interaction.
      - **Bullet Points**: Displays a list of bullet points.
      - **Score Slide**: Displays the scores and rankings of players.

2. **Question Slides**
   - Interactive slides with the following question types:
     - **Multiple Choice**: Players select one or more options out of a list of options.
     - **Too Close To Call**: Players input a number and the closest number to the correct answer wins.
     - **Ticking Time Bomb**: Players take turns answering questions before the timer runs out.
     - **Fastest On The Buzzer**: The first player to press the buzzer gets to answer the question first.
     - **Free Text**: Players can input any text as an answer.
     - **Jeopardy**: Jeopardy style game where players answer questions to gain points.
     - **LocateIt**: Players have to find a location on a map.
     - **Meet Your Match**: Players have to match options to a given category.
     - **Rank It Right**: Players have to rank options in the correct order.

---

## Technologies

Zap! is built using modern technologies for optimal performance and maintainability:

- **TypeScript**: Primary programming language.
- **React**: Frontend framework.
- **shadcn**: UI component library.
- **Firebase**: Backend and database solution.

---

## Getting Started

_Note: the repository name is outdated due to a rebranding of the project. It will be updated in the future._

1. Clone the repository:
   ```bash
   git clone https://github.com/FKnorring/Zap.git
   cd Zap
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

For more details, visit the [Developer Documentation](#developer-documentation).

---

## Code Structure

_Note: the repository name (and root directory by extension) is outdated due to a rebranding of the project. It will be updated in the future._

The project is organized into the following directories:

```plaintext

Zap/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── models/
│   ├── pages/
|   ├── routes/
│   ├── services/
│   ├── slides/
```

- **components**: Reusable UI components.
- **hooks**: Custom hooks for state management and side effects.
- **models**: Data models and interfaces.
- **pages**: Top-level components for different routes.
- **routes**: Routing configuration and navigation components.
- **services**: API services and utilities.
- **slides**: Slide components and utilities.

---

## Developer Documentation

### Environment Variables

- In order to run the application, you need to create a `.env` file in the root directory.
- The `.env` file should contain the following variables:
  - `VITE_ENVIRONMENT`: `DEV` or `PROD`
  - `VITE_FIREBASE_APIKEY`: The API key for the Firebase project.
  - `VITE_FIREBASE_AUTHDOMAIN`: The auth domain for the Firebase project.
  - `VITE_FIREBASE_PROJECTID`: The project ID for the Firebase project.
  - `VITE_FIREBASE_STORAGEBUCKET`: The storage bucket for the Firebase project.
  - `VITE_FIREBASE_MESSAGINGSENDERID`: The messaging sender ID for the Firebase project.
  - `VITE_FIREBASE_APPID`: The app ID for the Firebase project.
  - `VITE_FIREBASE_MEASUREMENTID`: The measurement ID for the Firebase project.
  - `VITE_FIREBASE_DATABASEURL`: The database URL for the Firebase project.
  - `VITE_QR_BASE_URL`: The base URL for the QR code generation ([ip]/play/).

### Hosting a Game

- Navigate to the host interface and create a quiz by combining different slide types.
- Save the game as a reusable template for future sessions.

### Player Interaction

- Players can join the game room using a unique code and interact through an intuitive interface.

### Adding New Features

- To add a new question type or slide type, add the type declaration to /src/models/Quiz.ts
- Create a new directory in /src/slides/[slide-type]
- In the new directory create the following files:
  - Preview.tsx: Renders the slide in the quiz editor.
  - Host.tsx: Renders the slide for the host.
  - Participant.tsx: Renders the slide for participants.
  - ParticipantAnswer.tsx: Renders the slide showing if the participant was correct/incorrect, awarded score etc.
  - Toolbar.tsx: Renders the form for editing the slide in the toolbar.
  - index.ts: Exports the slide components and metadata.
    - Define the slide metadata using the SlideInfo type.
      - `value` should be the same as the directory name.
      - `icon` should be a LucideIcon component.
      - `label` should be the same as the directory name.
      - `slideType` should be the same as the directory name.
      - `questionType` is only needed for question slides.
      - `defaults` should be the default values for the slide when it is created.
- In /src/slides/index.ts
  - Import and export the new slide type
- In /src/slides/utils.ts
  - Modify getSlideComponents to return the new slide type

### Adding New Languages

Follow these steps to add a new language to the application:

#### 1. Create the Language Files

1. Navigate to the directory: `Zap/public/locales`.
2. Create a new folder named after the **language code**. Use standard [ISO 639-1] language codes.
3. Inside the new folder, add the corresponding translation files. Use the existing folders (e.g., `en` or `sv`) as references for structure and content.

#### 2. Add the Language Name to `general.json` Files

1. Open the `general.json` file for each existing language folder (e.g., `Zap/public/locales/en/general.json`, `Zap/public/locales/sv/general.json`).
2. Add a new translation entry for the new language. For example, in the `en` `general.json` you would add:
   ```json
   {
     "{New_Language}": "{New_Language_In_English}"
   }
   ```

#### 3. Add the Language to the Config File

1. Open the file `Zap/src/config/languages.ts`
2. Add a new entry in the following way:

```ts
  {
     name: 'general:{NEW_LANGUAGE}',
     value: '{LANGUAGE_CODE}',
   },
```

---

## Contributors

- [Jacob Dillström](https://www.linkedin.com/in/jacob-dillstrom/) ([GitHub](https://github.com/Dillenzz))
- [Elisabet Hansson](https://www.linkedin.com/in/lisa-hansson/) ([GitHub](https://github.com/eliha458))
- [Filip von Knorring](https://www.linkedin.com/in/filip-v-4b9976139/) ([GitHub](https://github.com/FKnorring))
- [Nils Persson](https://www.linkedin.com/in/nils-albin-persson/) ([GitHub](https://github.com/NilssPersson))
- [Ramez Shakarna](https://www.linkedin.com/in/ramezshakarna/) ([GitHub](https://github.com/ramezio))