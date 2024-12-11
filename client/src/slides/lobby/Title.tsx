import { GameShackTitle } from '@/components/GameShackTitle';
import { t } from 'i18next';
import QRCode from 'react-qr-code';

interface TitleProps {
  title?: string;
  quizCode: string;
}

export default function Title({ title = 'Loading...', quizCode }: TitleProps) {
  return (
    <div className="flex gap-4 items-center justify-center w-full ">
      <div className=" flex flex-row gap-4 items-center justify-center bg-card w-fit p-4 rounded-lg">
        <QRCode
          style={{ height: 'auto', width: '220px', margin: '3' }}
          value={`${import.meta.env.VITE_QR_BASE_URL}${quizCode}`}
          viewBox={`0 0 256 256`}
        />

        <div className="flex-1 flex items-center justify-center">
          <span className="flex flex-col gap-4 items-center">
            <span className="text-2xl flex items-center gap-2">
              <GameShackTitle icon={false} className="text-5xl" />
            </span>
            <span className=" text-black text-6xl font-display w-fit">
              {title}
            </span>
            <span className="text-black font-display text-3xl">
              {t('slides:quizCode')} {quizCode}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
