import { type Quiz } from '@/models/Quiz';
import { Link } from 'react-router-dom';
import { Zap, WrenchIcon, SaveIcon, House, ZapIcon, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { CustomTooltip } from '../ui/custom-tooltip';
import { Separator } from '../ui/separator';
import { useHostQuiz } from '@/hooks/useHostQuiz';
import { useState } from 'react';
import { QuizPreview } from './QuizPreview';

interface QuizEditorHeaderProps {
  quiz: Quiz;
  onSettingsClick: () => void;
  onSaveClick: () => void;
  hasUnsavedChanges?: boolean;
  isSaving?: boolean;
}

export default function QuizEditorHeader({
  quiz,
  onSettingsClick,
  onSaveClick,
  hasUnsavedChanges,
  isSaving,
}: QuizEditorHeaderProps) {
  const { t } = useTranslation();
  const { hostQuizEditor } = useHostQuiz();
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleHostGame = async () => {
    try {
      onSaveClick();
      await hostQuizEditor(quiz);
    } catch (error) {
      console.error('Error hosting quiz', error);
    }
  };

  return (
    <div className="min-h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 text-black">
      <QuizPreview
        quiz={quiz}
        isOpen={previewOpen}
        setIsOpen={setPreviewOpen}
      />
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="flex items-center text-2xl font-display rounded-full p-1"
        >
          <Zap className="text-yellow-400 " size={26} />
          <span className="fancy-wrap text-white">Zap!</span>
        </Link>
        <h1 className="text-2xl font-display">{quiz.quiz_name}</h1>
        {hasUnsavedChanges && (
          <span className="text-md text-red-500">
            {t('quizEditor:unsavedChanges')}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <CustomTooltip content={t('quizEditor:preview.tooltip')}>
          <Button
            variant="outline"
            disabled={!quiz.slides || quiz.slides.length === 0}
            onClick={() => setPreviewOpen(true)}
            className="bg-blue-300"
            isInteractive
          >
            {t('quizEditor:preview.text')}
            <Eye className="w-7 h-7" />
          </Button>
        </CustomTooltip>
        <CustomTooltip content={t('quizEditor:startTheQuiz')}>
          <Button
            variant="outline"
            onClick={handleHostGame}
            className="bg-green-500"
            isInteractive
          >
            {t('homepage:startQuiz')}
            <ZapIcon className="w-7 h-7" />
          </Button>
        </CustomTooltip>
        <CustomTooltip content={t('quizEditor:quizSettings')}>
          <Button
            variant="outline"
            onClick={onSettingsClick}
            isInteractive
          >
            {t('general:settings')}
            <WrenchIcon className="w-7 h-7" />
          </Button>
        </CustomTooltip>
        <Separator orientation="vertical" className="h-8 bg-black/25 mx-2" />
        <Link to="/">
          <CustomTooltip content={t('quizEditor:goHome')}>
            <Button variant="outline">
              {t('general:home')}
              <House className="w-7 h-7" />
            </Button>
          </CustomTooltip>
        </Link>
        <CustomTooltip content={t('quizEditor:saveQuiz')}>
          <Button
            variant={hasUnsavedChanges ? 'default' : 'outline'}
            onClick={onSaveClick}
            disabled={isSaving || !hasUnsavedChanges}
          >
            {t('quizEditor:save')}
            <SaveIcon className="w-6 h-6" />
          </Button>
        </CustomTooltip>
      </div>
    </div>
  );
}
