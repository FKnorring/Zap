import { useTranslation } from 'react-i18next';
import { ToolbarProps } from '../../toolbar';
import TextInput from './TextInput';
import { Slide } from '@/models/Quiz';

export default function ContentInput<T extends Slide>({
  slide,
  onSlideUpdate,
}: ToolbarProps<T>) {
  const { t } = useTranslation(['quizEditor']);

  return (
    <TextInput
      slide={slide}
      onSlideUpdate={onSlideUpdate}
      label={t('content')}
      field="content"
      placeholder={t('enterContent')+"..."}
      textArea
    />
  );
}
