import { Button } from '@/components/ui/button';
import { WiggleText } from '@/components/WiggleText';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import QuestionCarousel from '@/pages/home/QuestionCarousel';
import AvatarCarousel from './AvatarCarousel';
import dallebomb from '@//utils/images/dalle/dallebomb.webp';
import dallebutton from '@/utils/images/dalle/dallebutton.webp';
import dalleflag1 from '@/utils/images/dalle/dalleflag1.webp';
import { useTranslation } from 'react-i18next';
import HowItWorks from './HowItWorks';
import HowItWorksPhone from './HowItWorksPhone';

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

const imageData = [
  {
    img: dallebomb,
    text: 'In Ticking Timebomb, players take turns answering questions within a set time. If time runs out, you lose a life. The last player standing wins!',
  },
  {
    img: dalleflag1,
    text: 'Think you know geography? Pin the right location on the world map! Choose from various difficulty levels, ranging from landmarks to precise locations, and test your knowledge with different settings!',
  },
  { img: dallebutton, text: 'Know the answer? Press the button!' },
  { img: 'anotherImageURL', text: 'Explanation for image 4' },
];
const titles: string[] = [
  'Ticking Time Bomb',
  'Locate It',
  'Fastest Finger First',
];

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
              className="text-center text-8xl font-bold font-display fancy-wrap"
            />
          </div>
          <div className="mt-5 flex flex-col justify-center items-center gap-y-3  ">
            <h1 className="text-5xl font-display text-center text-black ">
              {t('homepage:slogan')}
            </h1>

            <h3 className="text-gray-500 lg:w-1/2 sm:w-4/5 text-center text-2xl font-display m-2">
              {t('homepage:inspotext')}
            </h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <Button
              className="font-display lg:text-7xl text-4xl outline outline-3 m-4  p-16  bg-green-500 text-white hover:bg-white hover:text-black"
              size="lg"
              onClick={() => register()}
            >
              {t('homepage:signUp')}
            </Button>
          </div>
        </div>

        {/* Container for Title and Carousel */}
        <div>
          {' '}
          <QuestionCarousel images={imageData} titles={titles} />;
        </div>

        <div className="w-full bg-[#F8F8F8]">
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
      <div className="hidden lg:flex flex-col">
        <div className="flex-row"></div>
      </div>
    </div>
  );
}

export default Home;
