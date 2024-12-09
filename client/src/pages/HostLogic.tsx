import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SlideTypes, ShowCorrectAnswerTypes } from "@/models/Quiz";
import { getSlideComponents } from "@/slides/utils";
import Countdown from "react-countdown";
import EndScreen from "@/slides/_specials/endscreen/EndScreen";
import { useHostLogic } from "@/hooks/useHostLogic";

function HostLogic() {
  const { id } = useParams();
  const { 
    ongoingQuiz, 
    getCurrentSlide, 
    nextSlide, 
    showAnswer, 
    endQuiz,
    handleAddPoints 
  } = useHostLogic(id);

  if (!ongoingQuiz) return <div>Loading Quiz...</div>;

  

  const slide = getCurrentSlide();
  
  if (!ongoingQuiz.quiz.slides || !slide) {
    return (
      <EndScreen
        quiz={ongoingQuiz.quiz}
        endQuiz={() => endQuiz(ongoingQuiz.id)}
        participants={Object.values(ongoingQuiz.participants || {})}
      />
    );
  }

  const SlideComponent = getSlideComponents(slide);

  const RenderButtons = () => {
    if (slide.type !== SlideTypes.question) return null;

    return (
      <div className="flex flex-col">
        {!ongoingQuiz.isShowingCorrectAnswer && slide.timeLimit > 0 && (
          <div>
            <Countdown
              date={Date.now() + slide.timeLimit * 1000}
              onComplete={showAnswer}
            />
          </div>
        )}
        {!ongoingQuiz.isShowingCorrectAnswer &&
          slide.showCorrectAnswer == ShowCorrectAnswerTypes.manual && (
            <Button onClick={showAnswer} className="m-5">
              Show Answer
            </Button>
          )}
      </div>
    );
  };

  return (
    <>
      {!ongoingQuiz.isShowingCorrectAnswer ? (
        <SlideComponent.Host
          slides={ongoingQuiz.quiz.slides}
          currentSlide={ongoingQuiz.currentSlide}
          participants={Object.values(ongoingQuiz.participants || {})}
          slide={slide as never}
          onNextSlide={nextSlide}
          quizCode={ongoingQuiz.id}
          slideNumber={ongoingQuiz.currentSlide}
          

        />
      ) : (
        <SlideComponent.HostAnswer
          participants={Object.values(ongoingQuiz.participants)}
          slide={slide as never}
          onNextSlide={nextSlide}
          quizCode={ongoingQuiz.id}
          handleAddPoints={handleAddPoints}
          
        />
      )}
      <RenderButtons />
    </>
  );
}

export default HostLogic;
