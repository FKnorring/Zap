import { useTranslation } from 'react-i18next';
import { Link } from 'lucide-react';
import LinkedInPhone from '@/pages/home/LinkedInPhone'; // Import LinkedInPhone component

export default function AboutPhone() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col bg-white text-black p-4 h-screen overflow-auto pt-10">
      {/* About Text Section */}

      {/* LinkedIn Component for Phone */}
      <div className="w-full mb-4">
        <LinkedInPhone readMore={false} />{' '}
        {/* Use LinkedInPhone component here */}
      </div>

      {/* Goals Section */}
      <div className="bg-gray-200 p-4 rounded-lg shadow-lg w-full mb-4">
        <h3 className="text-xl font-bold font-display mb-3">
          {t('about:goalsTitle')}
        </h3>
        <p className="text-md text-gray-700 font-display">
          {t('about:goalsText')}
        </p>
      </div>

      {/* Status Section */}
      <div className="bg-gray-200 p-4 rounded-lg shadow-lg w-full mb-4">
        <h3 className="text-xl font-bold font-display mb-3">
          {t('about:statusTitle')}
        </h3>
        <p className="text-md text-gray-700 font-display">
          {t('about:statusText')}
        </p>
      </div>

      {/* GitHub Link */}
      <div className="text-center w-full mt-6">
        <a
          href="https://github.com/FKnorring/GameShack"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl pb-6 font-display flex items-center justify-center gap-2 text-blue-400 hover:text-blue-600 transition"
        >
          {t('about:github')}
          <Link size={20} />
        </a>
      </div>
    </div>
  );
}
