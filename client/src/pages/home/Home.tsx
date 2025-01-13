import { Button } from '@/components/ui/button';
import { WiggleText } from '@/components/WiggleText';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import QuestionCarousel from '@/pages/home/QuestionCarousel';
import AvatarCarousel from './AvatarCarousel';
import { useTranslation } from 'react-i18next';

import HowItWorks from './HowItWorks';
import HowItWorksPhone from './HowItWorksPhone';

import { Card, CardContent } from '@/components/ui/card';
import LinkedInComponent from './LinkedInComponent';
import LinkedInPhone from './LinkedInPhone';
import { Link } from 'react-router-dom';
import { Footer } from '@/components/Footer';

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
const randomStrings = Array.from({ length: 25 }, () =>
  generateRandomString(30)
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

  for (const randomString of randomStrings) {
    for (const collectionName of collectionNames) {
      avatarData.push({
        avatarString: randomString,
        collectionName: collectionName,
      });
    }
  }

  return avatarData;
};

const avatarData = generateRandomAvatarData();

function Home() {
  const { register } = useKindeAuth();

  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-start overflow-auto overflow-x-hidden h-screen w-full bg-[#F8F8F8]">
      <div className="flex-1 flex flex-col items-center justify-start mt-5 w-full">
        {/* "Zap!" text */}
        <div className="flex-1 w-full sm:w-4/5 py-4">
          <div className="flex items-center justify-center gap-4 py-4">
            <WiggleText
              text="Zap!"
              className="text-center text-6xl font-bold font-display fancy-wrap"
            />
          </div>
          <div className="flex md:hidden flex-col flex-1 gap-2 items-center justify-center my-8 px-4">
            <Link to="/play" className='w-full'>
              <Button
                className="w-full font-display lg:text-4xl text-2xl p-8 border-primary border-2 text-white hover:bg-white hover:text-black hover:border-black hover:border-2 rounded-2xl"
                size="lg"
                isInteractive
                interactiveStyles='w-full'
              >
                {t('general:play')}
              </Button>
            </Link>
            <Button
              className="w-full font-display lg:text-4xl text-2xl p-8 bg-green-500 border-2 border-green-500 text-white hover:bg-white hover:text-black hover:border-black hover:border-2 rounded-2xl"
              size="lg"
              isInteractive
              interactiveStyles='w-full'
              onClick={() => register()}
            >
              {t('general:register')}
            </Button>
          </div>
          <div className="mt-5 mb-2 flex flex-col justify-center items-center gap-y-3 mx-auto">
            <h1 className="w-4/5 lg:w-1/2 text-3xl md:text-5xl font-display text-center text-gray-800 mx-4 text-balance">
              {t('homepage:slogan')}
            </h1>

            <h3 className="text-gray-500 w-4/5 lg:w-1/2 text-center text-lg mx-4 text-balance tracking-tight leading-snug">
              {t('homepage:inspotext')}
            </h3>
          </div>
          <div className="hidden md:flex flex-1 md:flex-row gap-4 items-center justify-center my-8 px-4">
            <Link to="/play">
              <Button
                className="w-full font-display lg:text-4xl text-2xl p-8 border-primary border-2 text-white hover:bg-white hover:text-black hover:border-black hover:border-2 rounded-2xl"
                size="lg"
                isInteractive
                interactiveStyles='w-fit'
            >
                {t('general:play')}
              </Button>
            </Link>
            <Button
              className="w-full font-display lg:text-4xl text-2xl p-8 bg-green-500 border-2 border-green-500 text-white hover:bg-white hover:text-black hover:border-black hover:border-2 rounded-2xl"
              size="lg"
              isInteractive
              interactiveStyles='w-fit'
              onClick={() => register()}
            >
              {t('general:register')}
            </Button>
          </div>
        </div>

        {/* Container for Title and Carousel */}
        <div className="flex-1 w-full">
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


        <div className="w-full overflow-x-auto hidden lg:block my-8">
          <LinkedInComponent readMore={true} />
        </div>

        <div className="w-full block lg:hidden">
          <LinkedInPhone readMore={true} />
        </div>

        <div>
          <AvatarCarousel avatars={avatarData}></AvatarCarousel>
        </div>
        {/* Avatar Carousel */}
      </div>


      <div className="flex flex-col items-center w-full mt-10 mb-10">
        <h1 className="text-gray-800 font-display text-3xl text-center">
          Try out our templates!
        </h1>
        <div className="w-full max-w-7xl mt-8">
          <Card className="bg-[#F9F8FE] shadow-lg">
            <CardContent className="min-h-[300px] flex items-center justify-center">
              {/* Add content here */}
              <p className=" text-2xl text-gray-700 font-displayP">
                No templates available yet!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
