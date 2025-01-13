import { cn } from '@/lib/utils';
import { VolumeX, Volume2, StepBack, StepForward, X } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export default function NextSlide({
  onNext,
  onPrev,
  endQuiz,

  quizCode,
}: {
  onNext: () => void;
  onPrev: () => void;
  endQuiz: (quizCode: string) => void;

  quizCode: string;
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showConfirmEnd, setShowConfirmEnd] = useState(false); // State for confirmation dialog

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const toggleSettings = () => setShowSettings((prev) => !prev);

  // Function to handle the end quiz confirmation
  const handleEndQuiz = () => {
    setShowConfirmEnd(true); // Show the confirmation dialog
  };

  const confirmEndQuiz = () => {
    endQuiz(quizCode); // Confirm and end the quiz
    setShowConfirmEnd(false); // Close the confirmation dialog
  };

  const cancelEndQuiz = () => {
    setShowConfirmEnd(false); // Close the confirmation dialog without ending the quiz
  };

  return (
    <div className="absolute z-2 bottom-4 right-4 flex items-center gap-4 border-2 border-primary bg-primary text-background text-xl rounded-md p-2">
      {/* Navigation Button */}
      <button
        onClick={onPrev}
        className={cn(' hidden  items-center gap-3 ', 'transition-all')}
        aria-label="Previous Slide"
      >
        <StepBack size={32} />
      </button>

      {/* Settings Button */}
      <Dialog open={showSettings} onOpenChange={toggleSettings}>
        <DialogTrigger asChild>
          <button
            className={cn(
              'flex items-center gap-3 bg-red-500 p-1 rounded-lg ',
              'transition-all'
            )}
            aria-label="Settings"
          >
            <X size={32} />
          </button>
        </DialogTrigger>

        {/* Settings Popup (Dialog) */}
        <DialogContent className="p-4 w-48 bg-background border border-primary shadow-lg rounded-md">
          <DialogHeader>
            <DialogTitle className=" text-2xl font-display">
              Settings
            </DialogTitle>
          </DialogHeader>

          {/* Dialog Body with Buttons */}
          <button
            onClick={handleEndQuiz} // Open confirmation dialog
            className="w-full text-center font-display px-3 py-2 hover:bg-primary hover:text-background rounded-md "
          >
            End Quiz
          </button>

          <DialogFooter>{/* Optional footer content */}</DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Next Slide Button */}
      <button className="p-1" onClick={onNext}>
        <StepForward size={32} />
      </button>

      {/* Volume Toggle */}
      <button
        onClick={toggleMute}
        className={cn('flex items-center justify-center p-1')}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <VolumeX size={32} /> : <Volume2 size={32} />}
      </button>

      {/* End Quiz Confirmation Dialog */}
      <Dialog open={showConfirmEnd} onOpenChange={setShowConfirmEnd}>
        <DialogContent className="p-4 bg-background border border-primary shadow-lg rounded-md">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>

          <div className="flex justify-between gap-4">
            {/* Use regular button elements */}
            <button
              onClick={confirmEndQuiz}
              className="w-full text-left px-3 py-2 hover:bg-primary hover:text-background rounded-md"
            >
              Yes, End Quiz
            </button>
            <button
              onClick={cancelEndQuiz}
              className="w-full text-left px-3 py-2 hover:bg-secondary hover:text-background rounded-md"
            >
              No, Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
