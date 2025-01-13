import { useParams } from 'react-router-dom';
import { QuestionTypes, SlideTypes } from '@/models/Quiz';
import { getSlideComponents } from '@/slides/utils';
import Countdown from 'react-countdown';
import EndScreen from '@/slides/_specials/endscreen/EndScreen';
import { useHostLogic } from '@/hooks/useHostLogic';
import answerTempQeustion from '@/pages/participantQuizView/ParticipantLogic';
import { ParticipantAnswers } from '@/slides/_components/ParticipantAnswers';
import Spinner from '@/components/Spinner';

import {
  getLocalStorageValue,
  setLocalStorageValue,
  removeLocalStorageValue,
} from '@/utils/localstorage';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { global_values } from '@/config/values';
import { QuizBackground } from '@/components/quiz-editor/QuizBackground';

function HostLogic() {
  const { id } = useParams();
  const {
    ongoingQuiz,
    getCurrentSlide,
    nextSlide,
    prevSlide,
    changeTurn,
    updateSlideUsedAnswers,

    endQuiz,
    handleAddPoints,
    removeParticipant,
  } = useHostLogic(id);

  const [countdownEndDate, setCountdownEndDate] = useState<number | null>(null);
  const [currentSlideId, setCurrentSlideId] = useState<string | null>(null);

  useEffect(() => {
    if (!ongoingQuiz || !ongoingQuiz.quiz.slides) return;

    const slide = getCurrentSlide();

    if (!slide || slide.type !== SlideTypes.question || slide.timeLimit <= 0) {
      setCountdownEndDate(null);
      return;
    }

    if (currentSlideId !== slide.id) {
      removeLocalStorageValue('quiz_timer');
      setCurrentSlideId(slide.id);
    }

    const storedEndDate = Number(getLocalStorageValue('quiz_timer'));
    const currentTime = Date.now();

    if (storedEndDate && !isNaN(storedEndDate)) {
      const delta = storedEndDate - currentTime;
      if (delta > 0) {
        setCountdownEndDate(storedEndDate);
        return;
      }
    }
    // If no valid stored end date, set a new one
    let newEndDate = currentTime + slide.timeLimit * 1000;
    if (slide.questionType === QuestionTypes.MCQSA) {
      newEndDate += global_values.waiting_time;
    }

    setCountdownEndDate(newEndDate);
    setLocalStorageValue('quiz_timer', newEndDate);
  }, [ongoingQuiz, getCurrentSlide]);

  const handleComplete = () => {
    if (slide?.id !== currentSlideId) return;
    const complete = removeLocalStorageValue('quiz_timer');
    if (complete) nextSlide();
  };

  if (!ongoingQuiz) return <Spinner />;

  const slide = getCurrentSlide();

  if (!ongoingQuiz.quiz.slides || !slide) {
    return (
      <>
        <QuizBackground
          backgroundColor={ongoingQuiz.quiz.settings.backgroundColor}
          primaryColor={ongoingQuiz.quiz.settings.primaryColor}
          secondaryColor={ongoingQuiz.quiz.settings.secondaryColor}
          className="inset-0 fixed z-[-1]"
        />
        <EndScreen
          quiz={ongoingQuiz.quiz}
          endQuiz={() => endQuiz(ongoingQuiz.id)}
          participants={Object.values(ongoingQuiz.participants || {})}
        />
      </>
    );
  }
  const SlideComponent = getSlideComponents(slide);

  const RenderTimer = () => {
    if (slide.type !== SlideTypes.question) return null;

    return (
      <div className="flex flex-col absolute bottom-5 left-5 m-5">
        {!ongoingQuiz.isShowingCorrectAnswer &&
          slide.timeLimit > 0 &&
          countdownEndDate && (
            <Countdown
              date={countdownEndDate}
              onComplete={handleComplete}
              renderer={({ completed, total }) => {
                if (completed) {
                  return (
                    <span className="text-red-500 font-bold">Time's up!</span>
                  );
                } else {
                  // Calculate total seconds remaining
                  const totalSeconds = Math.ceil(total / 1000);
                  const displayMinutes = Math.floor(totalSeconds / 60);
                  const displaySeconds = totalSeconds % 60;

                  if (
                    slide.questionType === QuestionTypes.MCQSA &&
                    totalSeconds > slide.timeLimit
                  ) {
                    return null; // Hide timer in waiting portion
                  }

                  // Format the display string
                  const formattedTime =
                    displayMinutes > 0
                      ? `${displayMinutes}:${displaySeconds}`
                      : `${displaySeconds}`;

                  return (
                    <div
                      style={{
                        width: '90px',
                        height: '90px',
                        position: 'relative',
                        bottom: '4',
                        left: '4',
                      }}
                    >
                      <motion.div
                        key={totalSeconds} // Triggers re-animation each second
                        animate={{ rotate: 90 }}
                        transition={{ duration: 1, ease: 'backIn' }}
                        style={{
                          width: '90px',
                          height: '90px',
                          backgroundColor: '#45b6fe',
                          borderColor: '#F4F3F2',
                          borderWidth: '3px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto',
                        }}
                      ></motion.div>
                      <span className="text-4xl font-display absolute inset-0 flex items-center justify-center">
                        {formattedTime}
                      </span>
                    </div>
                  );
                }
              }}
            />
          )}
      </div>
    );
  };

  const inLobby = ongoingQuiz.currentSlide == 0;

  return (
    <>
      <QuizBackground
        backgroundColor={ongoingQuiz.quiz.settings.backgroundColor}
        primaryColor={ongoingQuiz.quiz.settings.primaryColor}
        secondaryColor={ongoingQuiz.quiz.settings.secondaryColor}
        style={slide.backgroundStyle}
        className="inset-0 fixed z-[-1]"
      />
      {!ongoingQuiz.isShowingCorrectAnswer ? (
        <>
          <SlideComponent.Host
            answerTempQuestion={answerTempQeustion}
            slides={ongoingQuiz.quiz.slides}
            currentSlide={ongoingQuiz.currentSlide}
            participants={Object.values(ongoingQuiz.participants || {})}
            removeParticipant={removeParticipant}
            slide={slide as never}
            onNextSlide={nextSlide}
            onPrevSlide={prevSlide}
            endQuiz={endQuiz}
            quizCode={ongoingQuiz.id}
            slideNumber={ongoingQuiz.currentSlide}
            changeTurn={changeTurn}
            updateSlideUsedAnswers={updateSlideUsedAnswers}
            currentSlideTime={ongoingQuiz.currentSlideTime}
          />
          {!inLobby && (
            <ParticipantAnswers
              participants={Object.values(ongoingQuiz.participants || {})}
              removeParticipant={removeParticipant}
            />
          )}
        </>
      ) : (
        <SlideComponent.HostAnswer
          participants={Object.values(ongoingQuiz.participants)}
          slide={slide as never}
          onNextSlide={nextSlide}
          endQuiz={endQuiz}
          onPrevSlide={prevSlide}
          quizCode={ongoingQuiz.id}
          handleAddPoints={handleAddPoints}
        />
      )}

      <RenderTimer />
    </>
  );
}

export default HostLogic;
