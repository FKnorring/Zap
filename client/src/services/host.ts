// Skapa och lyssna på pågående quiz answer och uppdatera

import { useState, useEffect } from "react";
import { ref, off, onValue, runTransaction, update, set, get, DataSnapshot } from "firebase/database";
import { database } from "@/firebase";
import Participant from "@/models/Participant";
import Quiz, { QuestionSlide, QuestionType, QuestionTypes, answerTypes } from "@/models/Quiz";

export const useOngoingQuiz = () => {
  const [quizCode, setQuizCode] = useState("");
  const [participants, setPaticipants] = useState<Record<string, Participant>>();

    useEffect(() => {
    const participantsRef = ref(database, `ongoingQuizzes/${quizCode}/participants`);
    
    const handleQuizChange = (snapshot: DataSnapshot) => {
    if (snapshot.exists()) {
      const newParticipants = snapshot.val();
      setPaticipants(newParticipants);
    } else {
      console.error("No participants found");
      setPaticipants({});
    }
    };

    onValue(participantsRef, handleQuizChange);

    return () => {
        off(participantsRef, "value", handleQuizChange);
    };
    }, [quizCode]);


  // Function to update question number in Firebase
  const incrementSlide = async (quizCode: string) => {
    const slideOrderRef = ref(database, `ongoingQuizzes/${quizCode}/currentSlide`);
    try {
      // Increment CurrentSlideOrder by 1
      await runTransaction(slideOrderRef, (currentValue) => {
        return (currentValue) + 1;
      });
      console.log("CurrentSlideOrder incremented");

      // Reference to all participants
      const participantRef = ref(
        database,
        `ongoingQuizzes/${quizCode}/participants/`
      );

      // Get all participants to update
      const participantsSnapshot = (await get(participantRef));
      if (participantsSnapshot.exists()) {
        const updates: { [key: string]: any } = {};
        participantsSnapshot.forEach((participant: any) => {
          const participantKey = participant.key;
          updates[
            `ongoingQuizzes/${quizCode}/participants/${participantKey}/hasAnswered`
          ] = false;
          updates[
            `ongoingQuizzes/${quizCode}/participants/${participantKey}/answer`
          ] = "";
        });
        // Apply the updates to all participants
        await update(ref(database), updates);
        console.log("All participants' answers reset successfully");
      } else {
        console.log("No participants found");
      }

    } catch (error) {
      console.error(
        "Error updating CurrentSlideOrder or resetting participants:",
        error
      );
    }
    const ongoingQuiz = await get(
      ref(database, `ongoingQuizzes/${quizCode}`)
    );
    return ongoingQuiz.val();
  };

  const updateScore = async(quizCode: string, questionType: answerTypes) => {

    switch (questionType) {
      case answerTypes.singleString: {


      }
      case answerTypes.freeText: {
      
    }
    
    case answerTypes.multipleStrings: {
    
    }
    
    case answerTypes.rank: {
    
    }
      default: {
        break;
      }
    }

  }

  const generateQuizCode = async (): Promise<string> => {
    let quizCode = "";
    let isUnique = false;

    while (!isUnique) {
      // Generate a random 4-letter code
      quizCode = Array.from({ length: 4 }, () =>
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      ).join("");
    
      const quizRef = ref(
      database,
      `ongoingQuizzes/${quizCode}`
    )
      const quiz = await get(quizRef);
      if(await !quiz.exists()){
        isUnique = true
        return quizCode;
      }
    }
    setQuizCode(quizCode);
    return quizCode;
  };

  
  async function createOngoingQuiz(_quiz: Quiz): Promise<any> {
    const db = database;
    const quizCode = await generateQuizCode();

    console.log(_quiz)

    const quiz = {
      currentSlide: 0,
      quiz: _quiz,
      quizId: _quiz.id,
      quizHost: _quiz.user_id,
      participants: {},
      startedAt: new Date().toISOString().toLocaleString(),
    }
    try{
        await set(ref(db, "ongoingQuizzes/" + quizCode), quiz);
        return quizCode;
    }
    catch(error){
        console.error("Failed to create ongoing quiz", error);
    }
  }

  async function getOngoingQuiz(quizCode: string): Promise<any> {
    const quizRef = ref(database, "ongoingQuizzes/" + quizCode);
    try {
      const ongoingQuiz =  await get(quizRef);
      setQuizCode(quizCode);
      return ongoingQuiz.val();
    } catch (error) {
      console.error("Failed to get ongoing quiz", error);
    }
  }

  return {
    quizCode,
    participants,
    createOngoingQuiz,
    incrementSlide,
    getOngoingQuiz,
  };
};
