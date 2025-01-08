export * from './Preview';
export * from './ParticipantAnswer';
export * from './Participant';
export * from './Host';
export * from './HostAnswer';
export * from './CalculateScore';

import { FaBrain } from 'react-icons/fa';
import { AnswerTypes, QuestionTypes, ShowCorrectAnswerTypes, SlideTypes } from "@/models/Quiz";
import { nanoid } from "nanoid";
import { SlideInfo } from "@/slides";

const defaultCategories = [
  {
    id: nanoid(),
    name: "World Capitals",
    questions: Array(5).fill(null).map(() => ({
      id: nanoid(),
      answer: "",
      question: "",
    })),
  },
  {
    id: nanoid(),
    name: "Science Facts",
    questions: Array(5).fill(null).map(() => ({
      id: nanoid(),
      answer: "",
      question: "",
    })),
  },
  {
    id: nanoid(),
    name: "Famous Movies",
    questions: Array(5).fill(null).map(() => ({
      id: nanoid(),
      answer: "",
      question: "",
    })),
  },
  {
    id: nanoid(),
    name: "Tech Giants",
    questions: Array(5).fill(null).map(() => ({
      id: nanoid(),
      answer: "",
      question: "",
    })),
  },
  {
    id: nanoid(),
    name: "Sports Legends",
    questions: Array(5).fill(null).map(() => ({
      id: nanoid(),
      answer: "",
      question: "",
    })),
  },
];

// Add sample questions for each category
defaultCategories[0].questions = [
  { id: nanoid(), question: "This city, known as the 'City of Light', has been France's capital since 987 AD", answer: "What is Paris?" },
  { id: nanoid(), question: "This capital city sits on 14 islands and is known as the 'Venice of the North'", answer: "What is Stockholm?" },
  { id: nanoid(), question: "This Asian capital's name means 'Eastern Capital' in its language", answer: "What is Tokyo?" },
  { id: nanoid(), question: "This capital city was founded by Peter the Great in 1703", answer: "What is St. Petersburg?" },
  { id: nanoid(), question: "This South American capital is the highest administrative capital city in the world", answer: "What is La Paz?" },
];

defaultCategories[1].questions = [
  { id: nanoid(), question: "This noble gas is used in many colorful signs", answer: "What is Neon?" },
  { id: nanoid(), question: "This is the only metal that is liquid at room temperature", answer: "What is Mercury?" },
  { id: nanoid(), question: "This force keeps planets in orbit around the Sun", answer: "What is Gravity?" },
  { id: nanoid(), question: "This scientist developed the theory of general relativity", answer: "Who is Einstein?" },
  { id: nanoid(), question: "This is the hardest natural substance on Earth", answer: "What is Diamond?" },
];

defaultCategories[2].questions = [
  { id: nanoid(), question: "This 1994 film tells the story of a man waiting on a bench, sharing his life story", answer: "What is Forrest Gump?" },
  { id: nanoid(), question: "This 1977 space opera features Luke Skywalker and Princess Leia", answer: "What is Star Wars?" },
  { id: nanoid(), question: "This 1972 film about a mafia family was directed by Francis Ford Coppola", answer: "What is The Godfather?" },
  { id: nanoid(), question: "This 1939 film features a young girl's journey through a magical land", answer: "What is The Wizard of Oz?" },
  { id: nanoid(), question: "This 1993 film about dinosaurs was directed by Steven Spielberg", answer: "What is Jurassic Park?" },
];

defaultCategories[3].questions = [
  { id: nanoid(), question: "This company was founded in a garage in Palo Alto in 1939", answer: "What is HP (Hewlett-Packard)?" },
  { id: nanoid(), question: "This company's first product was a blue box designed to make free long-distance calls", answer: "What is Apple?" },
  { id: nanoid(), question: "This search giant's original name was BackRub", answer: "What is Google?" },
  { id: nanoid(), question: "This social media platform was originally called 'The Facebook'", answer: "What is Facebook?" },
  { id: nanoid(), question: "This company was originally an online bookstore called Cadabra", answer: "What is Amazon?" },
];

defaultCategories[4].questions = [
  { id: nanoid(), question: "This basketball player won 6 NBA championships with the Chicago Bulls", answer: "Who is Michael Jordan?" },
  { id: nanoid(), question: "This boxer proclaimed 'I am the greatest' and later became known as Muhammad Ali", answer: "Who is Cassius Clay?" },
  { id: nanoid(), question: "This soccer player is known as 'The King of Football'", answer: "Who is Pelé?" },
  { id: nanoid(), question: "This tennis player has won 23 Grand Slam singles titles", answer: "Who is Serena Williams?" },
  { id: nanoid(), question: "This hockey player was known as 'The Great One'", answer: "Who is Wayne Gretzky?" },
];

export const Info: SlideInfo = {
  value: 'question:JEOPARDY',
  icon: FaBrain,
  label: "Jeopardy",
  slideType: SlideTypes.question,
  questionType: QuestionTypes.JEOPARDY,
  defaults: {
    type: SlideTypes.question,
    questionType: QuestionTypes.JEOPARDY,
    answerType: AnswerTypes.jeopardy,
    mainTimeLimit: 10,
    answerTimeLimit: 6,
    points: 100,
    showCorrectAnswer: ShowCorrectAnswerTypes.auto,
    categories: defaultCategories,
    minScore: 100,
    maxScore: 500,
  },
}; 