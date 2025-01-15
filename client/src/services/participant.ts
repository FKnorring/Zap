import { useState, useEffect } from 'react';
import {
  ref,
  onValue,
  off,
  get,
  set,
  update,
  DataSnapshot,
  serverTimestamp,
} from 'firebase/database';
import { getFirebaseServices } from '@/firebase';
import { Participant, QuizSettings, Slide } from '@/models/Quiz';
import { nanoid } from 'nanoid';

// Helper functions to reduce duplication
const getQuizRef = (quizCode: string, path = '') => {
  const { database } = getFirebaseServices();
  return ref(database, `ongoingQuizzes/${quizCode}${path}`);
};

const getParticipantRef = (quizCode: string, participantId: string, path = '') => {
  return getQuizRef(quizCode, `/participants/${participantId}${path}`);
};

export const ParticipantService = {
  async checkIfGameExists(quizCode: string): Promise<boolean> {
    const snapshot = await get(getQuizRef(quizCode));
    return snapshot.exists();
  },

  async participantExists(quizCode: string, participantId: string): Promise<boolean> {
    const snapshot = await get(getParticipantRef(quizCode, participantId));
    return snapshot.exists();
  },

  async addParticipant(
    quizCode: string,
    name: string,
    avatar: string,
    collectionName: string
  ): Promise<string | null> {
    const participantId = nanoid();
    const quizExists = await this.checkIfGameExists(quizCode);

    if (!quizExists) {
      console.error('Game does not exist');
      return null;
    }

    const payload = {
      score: [0],
      hasAnswered: false,
      answers: [],
      name,
      avatar,
      participantId,
      collectionName,
      turn: false,
    };

    try {
      await set(getParticipantRef(quizCode, participantId), payload);
      return participantId;
    } catch (error) {
      console.error('Error adding participant:', error);
      return null;
    }
  },

  async addAnswer(
    quizCode: string,
    participantId: string,
    answer: string[],
    slideNumber: number
  ): Promise<boolean> {
    const participantExists = await this.participantExists(quizCode, participantId);
    if (!participantExists) {
      console.error('Participant does not exist in quiz');
      return false;
    }

    const participantRef = getParticipantRef(quizCode, participantId);
    const snapshot = await get(participantRef);
    if (!snapshot.exists()) {
      console.error('Participant data not found');
      return false;
    }

    const participantData = snapshot.val();
    const updatedAnswers = [
      ...(participantData.answers || []),
      { slideNumber, answer, time: serverTimestamp() },
    ];

    try {
      await update(participantRef, {
        answers: updatedAnswers,
        hasAnswered: true,
      });
      return true;
    } catch (error) {
      console.error('Error updating the answer:', error);
      return false;
    }
  },

  async addTempAnswer(
    quizCode: string,
    participantId: string,
    tempAnswer: string
  ): Promise<boolean> {
    const participantExists = await this.participantExists(quizCode, participantId);
    if (!participantExists) {
      console.error('Participant does not exist in quiz');
      return false;
    }

    try {
      await update(getParticipantRef(quizCode, participantId), {
        tempAnswer: { tempAnswer, time: new Date().toISOString() },
        hasAnswered: false,
      });
      return true;
    } catch (error) {
      console.error('Error updating the answer:', error);
      return false;
    }
  },

  async removeParticipant(quizCode: string, participantId: string): Promise<boolean> {
    try {
      await set(getParticipantRef(quizCode, participantId), null);
      return true;
    } catch (error) {
      console.error('Error removing participant:', error);
      return false;
    }
  },

  async removeTempAnswer(quizCode: string, participantId: string): Promise<void> {
    try {
      await set(getParticipantRef(quizCode, participantId, '/tempAnswer'), '');
    } catch (error) {
      console.error(`Failed to clear tempAnswer for participant ${participantId}:`, error);
      throw error;
    }
  },

  async getParticipant(quizCode: string, participantId: string): Promise<Participant | null> {
    const snapshot = await get(getParticipantRef(quizCode, participantId));
    return snapshot.exists() ? snapshot.val() : null;
  },

  async getQuizSlides(quizCode: string): Promise<Slide[]> {
    const snapshot = await get(getQuizRef(quizCode, '/quiz/slides'));
    return snapshot.exists() ? snapshot.val() : [];
  },

  async getQuizSettings(quizCode: string): Promise<QuizSettings | null> {
    const snapshot = await get(getQuizRef(quizCode, '/quiz/settings'));
    return snapshot.exists() ? snapshot.val() : null;
  }
};

// Custom Hook: useGameStatus
export const useGameStatus = (quizCode: string, participantId: string) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [participantData, setParticipantData] = useState<Participant | null>(null);
  const [turn, setListenTurn] = useState("");
  const [currentSlideTime, setCurrentSlideTime] = useState<string>("");

  useEffect(() => {
    const refs = {
      slide: getQuizRef(quizCode, '/currentSlide'),
      participant: getParticipantRef(quizCode, participantId),
      showAnswer: getQuizRef(quizCode, '/isShowingCorrectAnswer'),
      turn: getQuizRef(quizCode, '/turn'),
      slideTime: getQuizRef(quizCode, '/currentSlideTime')
    };

    const handlers = {
      slide: (snapshot: DataSnapshot) => setCurrentSlide(snapshot.exists() ? snapshot.val() : 0),
      participant: (snapshot: DataSnapshot) => setParticipantData(snapshot.exists() ? snapshot.val() : null),
      showAnswer: (snapshot: DataSnapshot) => setShowAnswer(snapshot.exists() ? snapshot.val() : false),
      turn: (snapshot: DataSnapshot) => setListenTurn(snapshot.exists() ? snapshot.val() : false),
      slideTime: (snapshot: DataSnapshot) => setCurrentSlideTime(snapshot.exists() ? snapshot.val() : false)
    };

    // Set up listeners
    Object.entries(refs).forEach(([key, ref]) => {
      onValue(ref, handlers[key as keyof typeof handlers]);
    });

    // Cleanup listeners
    return () => {
      Object.entries(refs).forEach(([key, ref]) => {
        off(ref, 'value', handlers[key as keyof typeof handlers]);
      });
    };
  }, [quizCode, participantId]);

  return { currentSlide, participantData, showAnswer, turn, currentSlideTime };
};
