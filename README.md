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

1. **Information Slide**

   - Presents information to players without interaction.

2. **Score Slide**

   - Displays the scores and rankings of players.

3. **Question Slide**
   - Interactive slides with the following question types:
     - **Single Answer MCQ**: Players select one correct option.
     - **Multiple Answer MCQ**: Players select multiple correct options.
     - **Text Answer**: Players provide a text response.
     - **Rank Answers**: Players arrange answers in the correct order.

---

## Technologies

Zap! is built using modern technologies for optimal performance and maintainability:

- **Figma**: For prototyping and design.
- **TypeScript**: Primary programming language.
- **shadcn**: UI component library.
- **React**: Frontend framework.
- **Firebase**: Backend and database solution.

---

## Getting Started

_Note: the repository name is outdated due to a rebranding of the project. It will be updated in the future._

1. Clone the repository:
   ```bash
   git clone https://github.com/FKnorring/GameShack.git
   cd GameShack
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

GameShack/
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

- Jacob Dillström
- Elisabet Hansson
- Filip von Knorring
- Nils Persson
- Ramez Shakarna

```

```
