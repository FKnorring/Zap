import { GameShackTitle } from '@/components/GameShackTitle';
import { t } from 'i18next';
import QRCode from 'react-qr-code';

interface TitleProps {
  title?: string;
  quizCode: string;
}

export default function Title({ title = 'Loading...', quizCode }: TitleProps) {
  return (
    <div className="flex items-center justify-center w-full gap-32">
      <div className="flex flex-row gap-8 items justify-center items-center bg-card w-fit p-4 rounded-lg">
        <QRCode
          style={{ height: 'auto', width: '220px', margin: '3' }}
          value={`${import.meta.env.VITE_QR_BASE_URL}${quizCode}`}
          viewBox={`0 0 256 256`}
        />

        <div className="flex flex-col items-center justify-center">
          <span className="text-black text-2xl font-bold">{t('slides:quizCode')}</span>
          <span className="text-black font-display text-9xl">
            {quizCode}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-2">
        <span className="text-8xl flex items-center gap-2">
          <GameShackTitle icon={false} className="text-8xl" />
        </span>
        <span className=" text-white text-6xl font-display w-fit">
          {title}
        </span>
      </div>
    </div>
  );
}
