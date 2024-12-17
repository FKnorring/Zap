import { useParams } from 'react-router-dom';
import { useQuizEditor } from '@/hooks/useQuizEditor';
import { SlideSidebar } from '@/components/quiz-editor/SlideSidebar';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { Editor } from '@/components/quiz-editor/Editor';
import { Toolbar } from '@/components/quiz-editor/Toolbar';
import { QuizBackground } from '@/components/quiz-editor/QuizBackground';
import { QuizSettingsToolbar } from '@/components/quiz-editor/QuizSettingsToolbar';
import { quizDefaults } from '@/components/quiz-editor/utils/quiz-defaults';
import Spinner from '@/components/Spinner';

function QuizEdit() {
  const { id } = useParams();
  const {
    quiz,
    error,
    slides,
    activeSlide,
    activeSlideId,
    showSettings,
    handleAddSlide,
    handleSlideUpdate,
    handleSlideDelete,
    handleSlideDuplicate,
    handleSlideMove,
    handleSave,
    handleQuizUpdate,
    setActiveSlideId,
    setShowSettings,
    hasUnsavedChanges,
    isSaving,
    handleSlideSwap,
  } = useQuizEditor(id);

  if (error) return <div>Error: {error}</div>;
  if (!quiz) return <Spinner />;

  const quizSettings = {
    ...quizDefaults,
    ...quiz.settings,
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <QuizBackground
        primaryColor={quiz.primary_color}
        secondaryColor={quiz.secondary_color}
        backgroundColor={quiz.background_color}
        className="absolute inset-0 -z-10"
      />
      <ResizablePanelGroup direction="horizontal" style={{ height: 'inherit' }}>
        <ResizablePanel defaultSize={20} minSize={12} maxSize={20}>
          <SlideSidebar
            quizName={quiz.quiz_name}
            slides={slides}
            onAddSlide={handleAddSlide}
            activeSlideId={activeSlideId}
            onSlideSelect={(slideId) => {
              setActiveSlideId(slideId);
              setShowSettings(false);
            }}
            onSlideDelete={handleSlideDelete}
            onSlideDuplicate={handleSlideDuplicate}
            onSlideMove={handleSlideMove}
            onSlideSwap={handleSlideSwap}
            onSettingsClick={() => setShowSettings(true)}
            onSaveClick={handleSave}
            hasUnsavedChanges={hasUnsavedChanges}
            isSaving={isSaving}
            backgroundColor={quizSettings.backgroundColor}
            primaryColor={quizSettings.primaryColor}
            secondaryColor={quizSettings.secondaryColor}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={60}>
          <Editor
            slide={activeSlide}
            onSlideUpdate={handleSlideUpdate}
            backgroundColor={quizSettings.backgroundColor}
            primaryColor={quizSettings.primaryColor}
            secondaryColor={quizSettings.secondaryColor}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={20} minSize={15}>
          {showSettings ? (
            <QuizSettingsToolbar quiz={quiz} onUpdate={handleQuizUpdate} />
          ) : activeSlide ? (
            <Toolbar slide={activeSlide} onSlideUpdate={handleSlideUpdate} />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground bg-secondary/90">
              Select a slide
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default QuizEdit;
