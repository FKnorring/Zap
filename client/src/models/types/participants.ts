export interface ParticipantAnswer {
  slideNumber: number;
  answer: string[];
  time: string;
}

export interface TempAnswer {
  time: string;
  tempAnswer: string;
}

export interface Participant {
  answers: Array<ParticipantAnswer>;
  tempAnswer?: TempAnswer;
  hasAnswered: boolean;
  avatar: string;
  name: string;
  participantId: string;
  score: number[];
  collectionName: string;
}
