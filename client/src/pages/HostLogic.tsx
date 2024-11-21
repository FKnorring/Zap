import React, { useEffect, useState } from "react";
import { useParams /* useNavigate */ } from "react-router-dom";
import { useOngoingQuiz } from "@/services/host";
import QuizLobby from "./QuizLobby";
import { Button } from "@/components/ui/button";
import {
  OngoingQuiz,
  QuestionSlide,
  SlideTypes,
  ShowCorrectAnswerTypes,
} from "@/models/Quiz";
import { getSlideComponents } from "@/slides/utils";

import Countdown from "react-countdown";

export interface LatestScore {
  id: string;
  score: number;
}

const HostLogic: React.FC = () => {
  const { id } = useParams();
  const [ongoingQuiz, setOngoingQuiz] = useState<OngoingQuiz>();
  const [showAnswer, setShowAnswer] = useState(false);
  const {
    quizCode,
    participants,
    totalAnswers,
    incrementSlide,
    getOngoingQuiz,
    updateScore,
  } = useOngoingQuiz();

  useEffect(() => {
    const setupLobby = async () => {
      try {
        const currentQuiz = await getOngoingQuiz(id || "");
        if (currentQuiz) {
          setOngoingQuiz(currentQuiz);
        }
      } catch (error) {
        console.error("Error setting up lobby:", error);
      }
    };

    setupLobby();
  }, [id]);

  useEffect(() => {
    console.log("Checking has answered");
    const checkAnsweres = async () => {
      if ((ongoingQuiz?.currentSlide ? ongoingQuiz?.currentSlide : 0) > 0) {
        const currentSlide =
          ongoingQuiz?.quiz.slides[ongoingQuiz.currentSlide - 1];
          const questionSlide = currentSlide as QuestionSlide;
          if (
            !(
              questionSlide.showCorrectAnswer == ShowCorrectAnswerTypes.never
            ) &&
            (participants?.length ? participants?.length : 0) > 0 &&
            totalAnswers == participants?.length
          ) {
            setShowAnswer(true);
        }
      }
    };
    checkAnsweres();
  }, [totalAnswers]);

  const nextSlide = async () => {
    setShowAnswer(false);
    console.log("Before nextSlide ", ongoingQuiz);
    const currentOngoingQuiz = await incrementSlide(quizCode);
    setOngoingQuiz(currentOngoingQuiz);
    console.log("nextSlide, fetched ongoing quiz: ", currentOngoingQuiz);
  };

  const nextSlideAfterQuestion = async (question: QuestionSlide) => {
    setShowAnswer(false);
    await updateScore(quizCode, question);
    const startedQuiz = await incrementSlide(quizCode);
    setOngoingQuiz(startedQuiz);
  };

  const Completionist: React.FC<{}> = ({}) => {
    setShowAnswer(true);
    return null; // Or return some UI if needed
  };

  const renderQuestionButtons = (questionSlide: QuestionSlide) => {
    console.log("Time limit:", questionSlide.timeLimit);
    return (
      <div className="flex flex-col">
        {!showAnswer && questionSlide.timeLimit > 0 && (
          <div>
            <Countdown date={Date.now() + questionSlide.timeLimit * 1000}>
              <Completionist />
            </Countdown>
            {questionSlide.showCorrectAnswer ===
              ShowCorrectAnswerTypes.manual && (
              <Button onClick={() => setShowAnswer(true)} className="m-5">
                Show Answer
              </Button>
            )}
          </div>
        )}
        <Button
          onClick={() => nextSlideAfterQuestion(questionSlide)}
          className="m-5"
        >
          Next Slide
        </Button>
      </div>
    );
  };

  // Render QuizLobby when currentSlide is 0
  if (ongoingQuiz?.currentSlide === 0) {
    return (
      <div>
        <div className="flex flex-col">
          <QuizLobby
            quizCode={quizCode}
            participants={participants ? participants : []}
          />
          <Button onClick={nextSlide} className="m-5">
            Start Game
          </Button>
        </div>
      </div>
    );
  } else {
    if (ongoingQuiz?.quiz.slides) {
      const currentSlide = ongoingQuiz?.currentSlide - 1;
      if (ongoingQuiz?.quiz.slides[currentSlide].type == SlideTypes.question) {
        const questionSlide = ongoingQuiz?.quiz.slides[
          currentSlide
        ] as QuestionSlide;
        const SlideComponent = getSlideComponents(questionSlide);
        return (
          <div>
            {!showAnswer && (
              <SlideComponent.Preview slide={questionSlide as never} />
            )}
            {showAnswer && <h1>Showing answer</h1>}
            {renderQuestionButtons(questionSlide)}
          </div>
        );
      } else {
        const slide = ongoingQuiz?.quiz.slides[currentSlide];
        const SlideComponent = getSlideComponents(slide);
        return (
          <div className="flex flex-col">
            <SlideComponent.Preview slide={slide as never} />
            <Button onClick={nextSlide} className="m-5">
              Next slide
            </Button>
          </div>
        );
      }
    } else {
      return (
        <h1 className="text-5xl font-display">
          Your Quiz is missing slides :(
        </h1>
      );
    }
  }
};

export default HostLogic;
