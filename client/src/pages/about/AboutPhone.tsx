import { useTranslation } from 'react-i18next';
import { Link } from 'lucide-react';
import LinkedInComponent from '@/pages/home/LinkedInComponent';

export default function AboutPhone() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col bg-white text-black p-4 h-screen overflow-auto pt-10">
      {/* About Text Section */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold font-display mb-4">
          {t('about:who')}
        </h1>
      </div>

      <div className="bg-gray-200 p-4 rounded-lg shadow-lg w-full mb-4">
        <p className="text-base text-gray-700 font-display">
          {t('about:introText')}
        </p>
      </div>

      {/* Goals Section */}
      <div className="bg-gray-200 p-4 rounded-lg shadow-lg w-full mb-4">
        <h3 className="text-xl font-bold font-display mb-3">
          {t('about:goalsTitle')}
        </h3>
        <p className="text-sm text-gray-700 font-display">
          {t('about:goalsText')}
        </p>
      </div>

      {/* Status Section */}
      <div className="bg-gray-200 p-4 rounded-lg shadow-lg w-full mb-4">
        <h3 className="text-xl font-bold font-display mb-3">
          {t('about:statusTitle')}
        </h3>
        <p className="text-sm text-gray-700 font-display">
          {t('about:statusText')}
        </p>
      </div>

      {/* LinkedIn Component with horizontal scrolling */}
      <div className="overflow-x-auto w-full">
        <LinkedInComponent readMore={true} />
      </div>

      {/* GitHub Link */}
      <div className="text-center w-full mt-6">
        <a
          href="https://github.com/FKnorring/GameShack"
          target="_blank"
          rel="noopener noreferrer"
          className="text-base font-display flex items-center justify-center gap-2 text-blue-400 hover:text-blue-600 transition"
        >
          {t('about:github')}
          <Link size={20} />
        </a>
      </div>
    </div>
  );
}
