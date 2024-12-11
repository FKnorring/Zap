import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export function Participant({
  answerTempQuestion,
}: {
  answerTempQuestion: (answer: string) => void;
}) {
  const { t } = useTranslation(['questions']);

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Button
        className="w-80 h-80 rounded-full text-4xl bg-red-600 text-white"
        onClick={() => {
          answerTempQuestion('');
          console.log('click');
        }}
      >
        {t('answer')}
      </Button>
    </div>
  );
}
