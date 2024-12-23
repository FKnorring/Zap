import { useState, useEffect } from 'react';
import nils from '../assets/photos/nils.jpeg';
import ramez from '../assets/photos/ramez.jpeg';
import lisa from '../assets/photos/lisa.jpeg';
import jacob from '../assets/photos/jacob.jpeg';
import filip from '../assets/photos/filip.jpeg';
import { useTranslation } from 'react-i18next';
import { Link } from 'lucide-react';

export default function About() {
  const { t } = useTranslation();
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLargeScreen) {
    return (
      <div className="flex flex-col justify-center items-center bg-gradient-to-b to-black  text-white p-4 overflow-hidden">
        {/* About Text Section */}
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
            {t('about:who')}
          </h1>
          <div className="bg-white/10 p-6 rounded-lg shadow-lg mb-10">
            <p className="text-lg md:text-xl text-gray-300 font-display">
              {t('about:introText')}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl items-start">
          {/* Photos Section */}
          <div className="flex-1 bg-white/5 p-6 rounded-lg shadow-lg">
            <h2 className="text-center text-3xl font-bold font-display mb-6">
              {t('about:team')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {[
                { src: lisa, name: 'Lisa Hansson' },
                { src: nils, name: 'Nils Persson' },
                { src: ramez, name: 'Ramez Shakarna' },
                { src: filip, name: 'Filip von Knorring' },
                { src: jacob, name: 'Jacob Dillström' },
              ].map((person, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center bg-gray-900 p-4 rounded-lg shadow-md"
                >
                  <img
                    src={person.src}
                    alt={person.name}
                    className="w-24 h-24 rounded-full shadow-lg mb-4 object-cover"
                  />
                  <p className="text-lg font-medium font-display text-gray-200">
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Goals and Status Section */}
          <div className="flex-1 space-y-6">
            <div className="bg-white/10 p-6 rounded-lg shadow-lg">
              <h3 className="text-3xl font-bold font-display mb-4">
                {t('about:goalsTitle')}
              </h3>
              <p className="text-lg md:text-xl text-gray-300 font-display leading-relaxed">
                {t('about:goalsText')}
              </p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg shadow-lg">
              <h3 className="text-3xl font-bold font-display mb-4">
                {t('about:statusTitle')}
              </h3>
              <p className="text-lg md:text-xl text-gray-300 font-display leading-relaxed">
                {t('about:statusText')}
              </p>
            </div>
          </div>
        </div>

        {/* GitHub Link */}
        <div className="text-center mt-8">
          <a
            href="https://github.com/FKnorring/GameShack"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl md:text-3xl font-display flex items-center justify-center gap-2 text-blue-400 hover:text-blue-600 transition"
          >
            {t('about:github')}
            <Link size={28} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center bg-[#172030]  text-white p-4">
      {/* Outer container (non-scrollable) */}
      <div className="w-full max-w-4xl  bg-gradient-to-b to-black mb-10">
        {/* About Text Section */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold font-display mb-4">
            {t('about:who')}
          </h1>
        </div>

        {/* Inner container (scrollable) */}
        <div
          className="overflow-y-auto from-gray-800 to-bg bg-gradient-to-b"
          style={{ maxHeight: 'calc(100vh - 200px)' }}
        >
          <div className="bg-white/10 p-4 rounded-lg shadow-lg w-full mb-4">
            <p className="text-base text-gray-300 font-display">
              {t('about:introText')}
            </p>
          </div>
          {/* Photos Section */}
          <div className="bg-white/5 p-4 rounded-lg shadow-lg w-full mb-4">
            <h2 className="text-center text-2xl font-bold font-display mb-4">
              {t('about:team')}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { src: lisa, name: 'Lisa Hansson' },
                { src: nils, name: 'Nils Persson' },
                { src: ramez, name: 'Ramez Shakarna' },
                { src: filip, name: 'Filip von Knorring' },
                { src: jacob, name: 'Jacob Dillström' },
              ].map((person, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center bg-gray-900 p-2 rounded-lg shadow-md"
                >
                  <img
                    src={person.src}
                    alt={person.name}
                    className="w-16 h-16 rounded-full shadow-lg mb-2 object-cover"
                  />
                  <p className="text-sm font-medium font-display text-gray-200">
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Goals Section */}
          <div className="bg-white/10 p-4 rounded-lg shadow-lg w-full mb-4">
            <h3 className="text-xl font-bold font-display mb-3">
              {t('about:goalsTitle')}
            </h3>
            <p className="text-sm text-gray-300 font-display">
              {t('about:goalsText')}
            </p>
          </div>

          {/* Status Section */}
          <div className="bg-white/10 p-4 rounded-lg shadow-lg w-full mb-4">
            <h3 className="text-xl font-bold font-display mb-3">
              {t('about:statusTitle')}
            </h3>
            <p className="text-sm text-gray-300 font-display">
              {t('about:statusText')}
            </p>
          </div>

          {/* GitHub Link */}
          <div className="text-center w-full">
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
      </div>
    </div>
  );
}
