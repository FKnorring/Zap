import { MCQMASlide } from '@/models/Quiz';
import { SlideTitle } from '@/slides/_components/SlideTitle';
import { SlideContent } from '@/slides/_components/SlideContent';
import RenderOptions from '@/slides/question/base/RenderOptions';
import { useTranslation } from 'react-i18next';

export function Preview({
  slide,
  onSlideUpdate,
}: {
  slide: MCQMASlide;
  onSlideUpdate: (slide: MCQMASlide) => void;
}) {
  const { t } = useTranslation(['quizEditor']);
  const numCorrectOptions = slide.options.filter(
    (option) => option.isCorrect
  ).length;

  const handleTitleChange = (newTitle: string) => {
    if (onSlideUpdate) {
      onSlideUpdate({ ...slide, title: newTitle });
    }
  };

  const handleContentChange = (newContent: string) => {
    if (onSlideUpdate) {
      onSlideUpdate({ ...slide, content: newContent });
    }
  };

  const handleOptionChange = (id: string, newText: string) => {
    const updatedOptions = slide.options.map((option) =>
      option.id === id ? { ...option, text: newText } : option
    );
    onSlideUpdate({ ...slide, options: updatedOptions });
  };

  const handleToggleCorrect = (id: string) => {
    const updatedOptions = slide.options.map((option) => {
      if (option.id === id) {
        if (numCorrectOptions === 1 && option.isCorrect) {
          return option;
        }
        return { ...option, isCorrect: !option.isCorrect };
      }
      return option;
    });
    onSlideUpdate({ ...slide, options: updatedOptions });
  };

  const handleDeleteOption = (id: string) => {
    if (slide.options.length === 1) {
      return;
    }

    const isDeletingCorrect = slide.options.find(
      (option) => option.id === id
    )?.isCorrect;

    const updatedOptions = slide.options.filter((option) => option.id !== id);

    if (isDeletingCorrect && numCorrectOptions === 1) {
      updatedOptions[0].isCorrect = true;
    }
    onSlideUpdate({ ...slide, options: updatedOptions });
  };

  const handleAddOption = () => {
    const newOption = {
      id: `option-${Date.now()}`,
      text: t('quizEditor:newOption'),
      isCorrect: false,
    };
    onSlideUpdate({ ...slide, options: [...slide.options, newOption] });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-10 space-y-8 w-full">
      <div className="flex flex-col w-full">
        <SlideTitle
          title={slide.title}
          isEditable={true}
          onTitleChange={handleTitleChange}
        />
      </div>
      <div className="flex flex-col w-full">
        <SlideContent
          content={slide.content}
          isEditable={true}
          onContentChange={handleContentChange}
        />
      </div>
      <RenderOptions
        isEditable={true}
        handleOptionChange={handleOptionChange}
        handleAddOption={handleAddOption}
        handleDeleteOption={handleDeleteOption}
        handleToggleCorrect={handleToggleCorrect}
        slide={slide}
      />
    </div>
  );
}
