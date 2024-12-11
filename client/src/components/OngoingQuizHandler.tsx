import { useAppContext } from "@/contexts/App/context";
import { Button } from "./ui/button";
import { ArrowLeftIcon, XIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OngoingQuizHandler() {
  const { ongoingQuizzes: { resources, isLoading, endQuiz } } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const inLobby = location.pathname.endsWith("/lobby");

  const ongoingQuiz = resources.length > 0 ? resources[0] : null;

  const shouldRenderHandler = !isLoading && !inLobby && ongoingQuiz;

  if (!shouldRenderHandler) return null;

  const handleGoToLobby = () => {
    navigate(`/quizzes/${ongoingQuiz.id}/lobby`);
  };

  const handleEndQuiz = () => {
    endQuiz(ongoingQuiz.id);
  };

  return (
    <div className="absolute right-0 top-1/2">
      <div className="mr-6 bg-card rounded p-4 text-black flex flex-col border shadow gap-2">
        <span className="text-xs text-muted-foreground">There is an ongoing quiz: {ongoingQuiz.id}</span>
        <div className="flex gap-2">
          <Button className="flex-1" size="sm" onClick={handleGoToLobby}>
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="text-xs">Go to</span>
          </Button>
          <Button className="flex-1" variant="destructive" size="sm" onClick={handleEndQuiz}>
            <span className="sr-only">End quiz</span>
            <XIcon className="w-4 h-4" />
            <span className="text-xs">End</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

