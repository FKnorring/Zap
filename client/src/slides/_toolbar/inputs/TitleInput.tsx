import { useTranslation } from 'react-i18next';
import { ToolbarProps } from '../../toolbar';
import TextInput from './TextInput';
import { Slide } from '@/models/Quiz';

export default function TitleInput<T extends Slide>({
  slide,
  onSlideUpdate,
}: ToolbarProps<T>) {
  const { t } = useTranslation(['quizEditor']);

  return (
    <TextInput
      id="title-input"
      slide={slide}
      onSlideUpdate={onSlideUpdate}
      label={t('title')}
      field="title"
      placeholder={t('enterTitle') + '...'}
    />
  );
}
