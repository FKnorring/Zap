import { Button } from '@/components/ui/button';
import { WiggleText } from '@/components/WiggleText';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import QuestionCarousel from '@/pages/home/QuestionCarousel';
import AvatarCarousel from './AvatarCarousel';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import HowItWorks from './HowItWorks';
import HowItWorksPhone from './HowItWorksPhone';
import nils from '@/assets/photos/nils.jpeg';
import ramez from '@/assets/photos/ramez.jpeg';
import lisa from '@/assets/photos/lisa.jpeg';
import jacob from '@/assets/photos/jacob.jpeg';
import filip from '@/assets/photos/filip.jpeg';
import { Card, CardContent } from '@/components/ui/card';

import { FaLinkedin } from 'react-icons/fa';

interface AvatarData {
  avatarString: string;
  collectionName: string;
}

const generateRandomString = (length: number): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Generate 50 random strings of length 10
const randomStrings = Array.from({ length: 50 }, () =>
  generateRandomString(15)
);

const collectionNames = [
  'botttsNeutral',
  'thumbs',
  'micah',
  'adventurerNeutral',
];

// Generate random avatar data by iterating through collection names
const generateRandomAvatarData = (): AvatarData[] => {
  const avatarData: AvatarData[] = [];

  for (let i = 0; i < 50; i++) {
    const randomString = randomStrings[i];
    const collectionIndex = i % collectionNames.length; // This will iterate through the 4 collections
    const randomCollection = collectionNames[collectionIndex];

    avatarData.push({
      avatarString: randomString,
      collectionName: randomCollection,
    });
  }

  return avatarData;
};

const avatarData = generateRandomAvatarData();

function Home() {
  const { register } = useKindeAuth();

  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-start overflow-auto overflow-x-hidden h-screen w-full bg-[#F8F8F8]">
      <div className="flex-1 flex flex-col items-center justify-start mt-10 w-full">
        {/* "Zap!" text */}
        <div className="flex-1 w-full sm:w-4/5">
          <div className="flex items-center justify-center gap-4">
            <WiggleText
              text="Zap!"
              className="text-center text-6xl font-bold font-display fancy-wrap"
            />
          </div>
          <div className="mt-5 flex flex-col justify-center items-center gap-y-3  ">
            <h1 className="text-5xl font-display text-center text-gray-800 mx-4 ">
              {t('homepage:slogan')}
            </h1>

            <h3 className="text-gray-500 lg:w-1/2 sm:w-4/5 text-center text-2xl font-display mx-4">
              {t('homepage:inspotext')}
            </h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <Button
              className="font-display lg:text-4xl text-2xl m-4  p-8  bg-green-500 text-white hover:bg-white hover:text-black hover:border-black hover:border-2"
              size="lg"
              isInteractive
              onClick={() => register()}
            >
              {t('general:register')}
            </Button>
          </div>
        </div>

        {/* Container for Title and Carousel */}
        <div className="flex-1 w-full">
          {' '}
          <QuestionCarousel />;
        </div>

        <div className="w-full">
          {/* Render HowItWorks for larger devices */}
          <div className="hidden lg:block">
            <HowItWorks />
          </div>

          {/* Render HowItWorksPhone for smaller devices */}
          <div className="block lg:hidden">
            <HowItWorksPhone />
          </div>
        </div>

        <div>
          <AvatarCarousel avatars={avatarData}></AvatarCarousel>
        </div>
        {/* Avatar Carousel */}
      </div>
      <div className="hidden lg:flex flex-col mt-4 items-center justify-center">
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
        <div className="flex-1 p-6 rounded-lg bg-[#F8F8F8]">
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
                className="flex flex-col items-center text-center bg-[#F9F8FE] p-8 rounded-lg shadow-md w-[280px] h-[280px]" // Fixed width and height
              >
                <img
                  src={person.src}
                  alt={person.name}
                  className="w-32 h-32 rounded-full shadow-lg mb-4 object-cover mx-auto"
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
        </div>

        <div className="text-center mt-8">
          <Link to="/about">
            <Button
              variant={location.pathname === '/about' ? 'default' : 'ghost'}
              className=" mb-5 bg-primary p-4 text-2xl font-display text-gray-800"
            >
              {t('homepage:readmore')}
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-center w-full mt-10 mb-10">
        <h1 className="text-gray-800 font-display text-3xl text-center">
          Try out our templates!
        </h1>
        <div className="w-full max-w-7xl mt-8">
          <Card className="bg-[#F9F8FE] shadow-lg">
            <CardContent className="min-h-[300px] flex items-center justify-center">
              {/* Add content here */}
              <p className=" text-2xl text-gray-700 font-displayP">No shared quizzes available yet!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Home;
