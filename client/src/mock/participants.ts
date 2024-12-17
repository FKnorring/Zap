import { Participant } from '@/models/Quiz';

const firstNames = [
  'John',
  'Jane',
  'Bob',
  'Alice',
  'Charlie',
  'Emma',
  'David',
  'Sarah',
  'Michael',
  'Sophie',
  'James',
  'Emily',
  'Daniel',
  'Olivia',
  'William',
  'Ava',
  'Alexander',
  'Isabella',
  'Lucas',
  'Mia',
  'Henry',
  'Charlotte',
  'Benjamin',
  'Amelia',
  'Mason',
  'Harper',
  'Ethan',
  'Evelyn',
  'Oliver',
  'Abigail',
];

const lastNames = [
  'Doe',
  'Smith',
  'Wilson',
  'Brown',
  'Davis',
  'Miller',
  'Jones',
  'Lee',
  'Taylor',
  'Anderson',
  'Thomas',
  'Jackson',
  'White',
  'Harris',
  'Martin',
  'Thompson',
  'Garcia',
  'Martinez',
  'Robinson',
  'Clark',
  'Rodriguez',
  'Lewis',
  'Walker',
  'Hall',
  'Allen',
  'Young',
  'King',
  'Wright',
  'Scott',
  'Green',
];

export function generateRandomScore(): number[] {
  return Array(10)
    .fill(0)
    .map(() => [0, 250, 500, 750, 1000][Math.floor(Math.random() * 5)]);
}

export function generateParticipant(id: string): Participant {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return {
    name: `${firstName} ${lastName}`,
    participantId: id,
    avatar: `RANDOM${id}`,
    score: generateRandomScore(),
    answers: [],
    hasAnswered: false,
    collectionName: 'micah',
  };
}

export function getParticipants(count: number): Participant[] {
  return Array(count)
    .fill(null)
    .map((_, index) => generateParticipant((index + 1).toString()));
}

// Original participants list
export const participants: Participant[] = [
  {
    name: 'John Doe',
    participantId: '1',
    avatar: 'RANDOM1',
    score: [0, 0, 0, 1000, 0, 500, 1000, 1000, 1000, 0],
    answers: [],
    hasAnswered: false,
    collectionName: 'micah',
  },
  {
    name: 'Jane Smith',
    participantId: '2',
    avatar: 'RANDOM2',
    score: [1000, 500, 0, 750, 1000, 0, 500, 1000, 250, 750],
    answers: [],
    hasAnswered: false,
    collectionName: 'micah',
  },
  {
    name: 'Bob Wilson',
    participantId: '3',
    avatar: 'RANDOM3',
    score: [500, 500, 750, 0, 1000, 1000, 0, 250, 500, 1000],
    answers: [],
    hasAnswered: false,
    collectionName: 'micah',
  },
  {
    name: 'Alice Brown',
    participantId: '4',
    avatar: 'RANDOM4',
    score: [250, 1000, 500, 500, 0, 750, 1000, 0, 1000, 500],
    answers: [],
    hasAnswered: false,
    collectionName: 'micah',
  },
  {
    name: 'Charlie Davis',
    participantId: '5',
    avatar: 'RANDOM5',
    score: [750, 250, 1000, 0, 500, 1000, 750, 500, 0, 1000],
    answers: [],
    hasAnswered: false,
    collectionName: 'micah',
  },
  {
    name: 'Emma Wilson',
    participantId: '6',
    avatar: 'RANDOM6',
    score: [1000, 0, 500, 750, 250, 500, 1000, 750, 500, 0],
    answers: [],
    hasAnswered: false,
    collectionName: 'micah',
  },
  {
    name: 'David Miller',
    participantId: '7',
    avatar: 'RANDOM7',
    score: [500, 750, 1000, 500, 0, 250, 500, 1000, 750, 1000],
    answers: [],
    hasAnswered: false,
    collectionName: 'micah',
  },
  {
    name: 'Sarah Jones',
    participantId: '8',
    avatar: 'RANDOM8',
    score: [0, 1000, 750, 500, 1000, 500, 250, 500, 1000, 750],
    answers: [],
    hasAnswered: false,
    collectionName: 'micah',
  },
  {
    name: 'Michael Lee',
    participantId: '9',
    avatar: 'RANDOM9',
    score: [750, 500, 250, 1000, 500, 1000, 0, 750, 500, 1000],
    answers: [],
    hasAnswered: false,
    collectionName: 'micah',
  },
];

// Usage example:
// const numberOfParticipants = 30;
// const generatedParticipants = getParticipants(numberOfParticipants);
