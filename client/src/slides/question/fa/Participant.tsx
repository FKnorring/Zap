import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export function Participant({
  answerTempQuestion,
}: {
  answerTempQuestion: (answer: string) => void;
}) {
  const { t } = useTranslation(['questions']);

  return (
    <div className="flex flex-col items-center justify-center mt-60 p-8 gap-28 ">
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
