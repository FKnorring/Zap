import nils from '@/assets/photos/nils.jpeg';
import ramez from '@/assets/photos/ramez.jpeg';
import lisa from '@/assets/photos/lisa.jpeg';
import jacob from '@/assets/photos/jacob.jpeg';
import filip from '@/assets/photos/filip.jpeg';

import { FaLinkedin } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface LinkedInComponentProps {
  readMore: boolean;
}

function LinkedInComponent({ readMore }: LinkedInComponentProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col mt-4 items-center justify-center ">
      <div className="text-center mb-6 ">
        <h1 className="text-3xl font-display mb-4 text-gray-800">
          {t('about:who')}
        </h1>
      </div>
      <div className="p-4  rounded-lg  w-3/5 mb-4 bg-[#F9F8FE]">
        <p className="text-2xl text-gray-700 font-display">
          {t('about:introText')}
        </p>
      </div>
      <h2 className="text-center text-3xl  font-display mb-6 text-gray-800">
        {t('about:team')}
      </h2>
      <div className="flex-1 p-6 rounded-lg bg-[#F8F8F8] ">
        <div className="flex flex-row gap-6 justify-center items-center w-full">
          {[
            {
              src: lisa,
              name: 'Lisa Hansson',
              linkedin: 'https://www.linkedin.com/in/lisa-hansson/',
            },
            {
              src: nils,
              name: 'Nils Persson',
              linkedin: 'https://www.linkedin.com/in/nils-albin-persson/',
            },
            {
              src: ramez,
              name: 'Ramez Shakarna',
              linkedin: 'https://www.linkedin.com/in/ramezshakarna/',
            },
            {
              src: filip,
              name: 'Filip von Knorring',
              linkedin: 'https://www.linkedin.com/in/filip-v-4b9976139/',
            },
            {
              src: jacob,
              name: 'Jacob Dillström',
              linkedin: 'https://www.linkedin.com/in/jacob-dillstrom/',
            },
          ].map((person, index) => (
            <div
              key={index}
              className="
                hover:scale-y-105 
                hover:scale-x-105 
                flex 
                flex-col 
                items-center 
                text-center 
                bg-[#F9F8FE] 
                p-6 
                rounded-lg 
                shadow-md 
                w-[220px] 
                h-[240px] 
                max-w-[240px] 
                transition 
                duration-300 
                ease-in-out
              "
            >
              <img
                src={person.src}
                alt={person.name}
                className="w-28 h-28 rounded-full shadow-lg mb-4 object-cover mx-auto"
              />
              <div className="flex flex-col justify-between items-center h-full">
                {' '}
                {/* Use full height for consistent spacing */}
                <a
                  className="flex flex-row justify-between space-x-2 items-center"
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin size={32} color="#0A66C2" />
                  <p className="text-xl font-medium font-display text-gray-700 hover:text-blue-500">
                    {person.name}
                  </p>
                </a>
              </div>
            </div>
          ))}
        </div>
        {readMore && (
          <div className="text-center mt-8">
            <Link to="/about">
              <Button
                variant={location.pathname === '/about' ? 'default' : 'ghost'}
                className="mb-5 bg-primary p-4 text-2xl font-display text-gray-800"
              >
                {t('homepage:readmore')}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default LinkedInComponent;
