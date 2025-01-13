import { useTranslation } from 'react-i18next';
import { Link } from 'lucide-react';
import LinkedInComponent from '@/pages/home/LinkedInComponent';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-start overflow-auto overflow-x-hidden h-dvh w-full bg-[#F8F8F8]">
      {/* LinkedIn Component */}
      <div className="flex-1 w-full pt-10">
        <LinkedInComponent readMore={false} />
      </div>

      {/* Goals Section */}
      <div className='flex gap-4 flex-row w-7/12'>
        <div className="flex-1 max-w-4xl p-6 rounded-lg bg-[#F9F8FE] shadow-md my-6">
          <h3 className="text-2xl font-display mb-2 text-gray-800">
            {t('about:goalsTitle')}
          </h3>
          <p className="text-gray-700">
            {t('about:goalsText')}
          </p>
        </div>

        {/* Status Section */}
        <div className="flex-1 max-w-4xl p-6 rounded-lg bg-[#F9F8FE] shadow-md my-6">
          <h3 className="text-2xl font-display mb-2 text-gray-800">
            {t('about:statusTitle')}
          </h3>
          <p className="text-gray-700">
            {t('about:statusText')}
          </p>
        </div>
      </div>

      {/* GitHub Link */}
      <div className="flex-1 text-center pb-10  mt-8">
        <a
          href="https://github.com/FKnorring/Zap"
          target="_blank"
          rel="noopener noreferrer"
          className="text-3xl font-display flex items-center justify-center gap-2 text-blue-400 hover:text-blue-600 transition"
        >
          {t('about:github')}
          <Link size={28} />
        </a>
      </div>
    </div>
  );
}
