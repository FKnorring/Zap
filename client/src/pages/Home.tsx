import { Button } from '@/components/ui/button';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { WiggleText } from '@/components/WiggleText';
import { useNavigate } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import bombpicture from '../utils/images/bombpicture.png';
import fff from '../utils/images/fff.png';
import rankitright from '../utils/images/rankitright.png';
import locateit from '../utils/images/locateit.png';
import Avatar from '@/Avatar';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';



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
console.log(avatarData); // Output the generated avatar data

function Home() {
  const { login, register } = useKindeAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handlePlay = () => {
    navigate('/play');
  };

  const images = [bombpicture, locateit, fff, rankitright];
  const titles: string[] = [
    'Ticking Time Bomb',
    'Locate It',
    'Fastest Finger First',
    'Order The List',
  ];

  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024); // Assuming 1024px is the breakpoint for large screens

  // Effect hook to listen for window resize
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // Update state based on window width
    };

    // Listen to the resize event
    window.addEventListener('resize', handleResize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="flex-1 flex flex-col items-center justify-start overflow-auto"
      style={{ maxHeight: 'calc(100vh - 65px)' }}
    >
      <div className="flex-1 flex flex-col items-center justify-start mt-10 ">
        {/* "Zap!" text */}
        <WiggleText
          text="Zap!"
          className="text-center text-9xl font-bold font-display fancy-wrap "
        />
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center lg:space-x-40  lg:space-y-0 mt-10">
          <div className="flex-1 flex flex-col items-center justify-center lg:gap-8 gap-0">
            <Button
              className="font-display text-7xl outline outline-3 w-5/6  p-12 lg:p-16 bg-green-500 text-white hover:bg-white hover:text-black "
              size="lg"
              onClick={handlePlay}
            >
              {t("homepage:playNow")}
            </Button>
            <div className="flex-1 flex flex-row items-center justify-center space-x-4 ">
              <Button
                className="font-display text-3xl outline outline-3 p-6 lg:p-10 mt-8 lg:mt-0 "
                size="lg"
                onClick={() => login()}
              >
               {t("homepage:signIn")}
              </Button>

              <Button
                className="font-display text-3xl outline outline-3 p-6 lg:p-10 mt-8  lg:mt-0"
                size="lg"
                onClick={() => register()}
              >
               {t("homepage:signUp")}
              </Button>
            </div>
          </div>

          {/* Container for Title and Carousel */}
          {isLargeScreen && (
            <div className="flex flex-col justify-center items-center m-4">
              <h1 className="lg:text4xl text-3xl  font-display mb-4 text-center m-4">
               {t("homepage:questionTypes")}
              </h1>

              <div className="text-center flex max-w-4xl items-center justify-center lg:w-[400px]">
                {/* Control carousel's width */}
                <Carousel increment={1} rotateTime={5} buttons={false}>
                  <CarouselContent>
                    {images.map((image, index) => (
                      <CarouselItem className="border-white" key={index}>
                        {/* Container for Title and Image */}
                        <div className="p-2">
                          {/* Title above the image */}
                          <h2 className="text-3xl font-display mb-2">
                            {titles[index]}
                          </h2>
                          <div className="rounded-lg border-4 border-white ">
                            <img src={image} alt={`Slide ${index + 1}`} />
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </div>
          )}
        </div>
        {isLargeScreen && <Separator className="mt-10 mb-10" />}
        {isLargeScreen && (
          <div className="w-full flex flex-col items-center text-center">
            <h1 className="font-display lg:text4xl text-3xl">
            {t("homepage:avatarText")}
              
            </h1>
            <div className="mt-10 flex flex-col items-center justify-center">
              <div className="w-full max-w-4xl">
                <Carousel increment={1} buttons={true}>
                  <CarouselContent>
                    {avatarData.map((avatar, index) => (
                      <CarouselItem
                        key={avatar.avatarString}
                        className="flex justify-center items-center p-4"
                      >
                        <div className="flex space-x-16">
                          {/* Display 3 different avatars in a row */}
                          <div className="flex flex-col items-center">
                            <Avatar
                              avatarString={avatar?.avatarString || ''}
                              collectionName={avatar?.collectionName || ''}
                            />
                          </div>
                          <div className="flex flex-col items-center">
                            {/* Render a different avatar for this item */}
                            <Avatar
                              avatarString={
                                avatarData[(3 * index + 1) % avatarData.length]
                                  ?.avatarString || ''
                              }
                              collectionName={
                                avatarData[(3 * index + 1) % avatarData.length]
                                  ?.collectionName || ''
                              }
                            />
                          </div>
                          <div className="flex flex-col items-center">
                            {/* Render another different avatar */}
                            <Avatar
                              avatarString={
                                avatarData[(3 * index + 2) % avatarData.length]
                                  ?.avatarString || ''
                              }
                              collectionName={
                                avatarData[(3 * index + 2) % avatarData.length]
                                  ?.collectionName || ''
                              }
                            />
                          </div>
                          <div className="flex flex-col items-center">
                            {/* Render another different avatar */}
                            <Avatar
                              avatarString={
                                avatarData[(3 * index + 3) % avatarData.length]
                                  ?.avatarString || ''
                              }
                              collectionName={
                                avatarData[(3 * index + 3) % avatarData.length]
                                  ?.collectionName || ''
                              }
                            />
                          </div>
                          <div className="flex flex-col items-center">
                            {/* Render another different avatar */}
                            <Avatar
                              avatarString={
                                avatarData[(3 * index + 4) % avatarData.length]
                                  ?.avatarString || ''
                              }
                              collectionName={
                                avatarData[(3 * index + 4) % avatarData.length]
                                  ?.collectionName || ''
                              }
                            />
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </div>
          </div>
        )}
        {isLargeScreen && (
          <div className="flex-col">
            <div className="flex-row "></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
