import { useTranslation } from 'react-i18next';
import { Link } from 'lucide-react';
import LinkedInComponent from '@/pages/home/LinkedInComponent';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-start overflow-auto overflow-x-hidden h-dvh w-full bg-[#F8F8F8]">
      {/* LinkedIn Component */}
      <div className="flex-1 w-full">
        <LinkedInComponent readMore={false} />
      </div>

      {/* Goals Section */}
      <div className='flex flex-row'>
        <div className="flex-1 w-full max-w-4xl p-6 rounded-lg bg-[#F9F8FE] shadow-md my-6">
          <h3 className="text-center text-3xl font-display mb-4 text-gray-800">
            {t('about:goalsTitle')}
          </h3>
          <p className="text-xl text-gray-700 font-display">
            {t('about:goalsText')}
          </p>
        </div>

        {/* Status Section */}
        <div className="flex-1 w-full max-w-4xl p-6 rounded-lg bg-[#F9F8FE] shadow-md my-6">
          <h3 className=" text-center text-3xl font-display mb-4 text-gray-800">
            {t('about:statusTitle')}
          </h3>
          <p className="text-xl text-gray-700 font-display">
            {t('about:statusText')}
          </p>
        </div>
      </div>

      {/* GitHub Link */}
      <div className="flex-1 text-center pb-10  mt-8 ">
        <a
          href="https://github.com/FKnorring/GameShack"
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
