import { Textarea } from '@/components/ui/textarea';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface SlideContentProps {
  content?: string;
  isEditable?: boolean;
  onContentChange?: (newContent: string) => void;
}

export function SlideContent({
  content = '',
  isEditable = false,
  onContentChange,
}: SlideContentProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [content]);

  const className =
    'md:text-[40px] text-[20px] text-center leading-normal font-display whitespace-pre-wrap border-2';

  if (isEditable) {
    return (
      <Textarea
        ref={textareaRef}
        placeholder={t('quizEditor:slideContentPlaceholder')}
        className={`${className} resize-none bg-transparent border-dashed overflow-hidden p-0`}
        value={content}
        onChange={(e) => onContentChange?.(e.target.value)}
        rows={1}
      />
    );
  }

  return <p className={`${className} border-transparent`}>{content}</p>;
}
