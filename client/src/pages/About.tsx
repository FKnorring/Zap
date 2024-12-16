import nils from '../assets/photos/nils.jpeg';
import ramez from '../assets/photos/ramez.jpeg';
import lisa from '../assets/photos/lisa.jpeg';
import jacob from '../assets/photos/jacob.jpeg';
import filip from '../assets/photos/filip.jpeg';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();
  return (
    <div className="p-2 overflow-y-auto bg-black/50 backdrop-blur-md flex-1">
      <h1 className="text-2xl font-bold mb-1 font-display">
        {t('about:title')}
      </h1>
      <p className="mb-4 max-w-2xl">{t('about:welcomeText')}</p>
      <h3 className="text-2xl font-bold mb-1 font-display">{t('about:who')}</h3>

      {/*Photos*/}
      <div className="space-y-8 my-10">
        <div className="flex flex-row justify-center gap-8 mb-3">
          <div className="flex flex-col items-center">
            <img
              src={lisa}
              alt="Lisa Hansson"
              className="w-24 h-24 rounded-full shadow-lg mb-2"
            />
            <p className="text-center text-white-700 font-display">
              Lisa Hansson
            </p>
          </div>
          <div className="flex flex-col items-center">
            <img
              src={nils}
              alt="Nils Persson"
              className="w-24 h-24 rounded-full shadow-lg mb-2"
            />
            <p className="text-center text-white-700 font-display">
              Nils Persson
            </p>
          </div>
          <div className="flex flex-col items-center">
            <img
              src={ramez}
              alt="Ramez Shakarna"
              className="w-24 h-24 rounded-full shadow-lg mb-2"
            />
            <p className="text-center text-white-700 font-display">
              Ramez Shakarna
            </p>
          </div>
        </div>
        <div className="flex flex-row justify-center gap-16">
          <div className="flex flex-col items-center">
            <img
              src={filip}
              alt="Filip von Knorring"
              className="w-24 h-24 rounded-full shadow-lg mb-2"
            />
            <p className="text-center text-white-700 font-display">
              Filip von Knorring
            </p>
          </div>
          <div className="flex flex-col items-center">
            <img
              src={jacob}
              alt="Jacob Dillström"
              className="w-24 h-24 rounded-full shadow-lg mb-2"
            />
            <p className="text-center text-white-700 font-display">
              Jacob Dillström
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-1 font-display">
        {t('about:goalsTitle')}
      </h3>
      <p className="mb-4 max-w-xl text-balance">{t('about:goalsText')}</p>
      <h3 className="text-2xl font-bold mb-1 font-display">
        {t('about:statusTitle')}
      </h3>
      <p className="mb-6">{t('about:statusText')}</p>
      <a
        href="https://github.com/FKnorring/GameShack"
        target="_blank"
        rel="noopener noreferrer"
        className="text-3xl font-display mb-8 hover:text-blue-900"
      >
        {t('about:github')}
      </a>
    </div>
  );
}
