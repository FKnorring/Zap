import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Avatar from '@/Avatar';
import {
  ArrowBigLeft,
  ArrowBigRight,
  Info as InfoIcon,
  Play,
} from 'lucide-react';
import useGetAuthenticatedUser from '@/hooks/useGetAuthenticatedUser';
import { userService } from '@/services/users';
import LanguageToggle from '@/components/Settings/LanguageToggle';
import { useTranslation } from 'react-i18next';
import { avatarCollections, collectionNames } from '@/utils'; // Adjust path to your collection exports

function createRandomId(length: number = 10): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

interface CreateParticipantProps {
  handleAddParticipant: (
    name: string,
    avatar: string,
    collectionName: string
  ) => void;
}

function GuestAdvancedView({
  onSubmit,
  isSubmitting,
  showError,
  setShowError,
}: {
  onSubmit: (name: string, avatar: string, collection: string) => void;
  isSubmitting: boolean;
  showError: boolean;
  setShowError: (val: boolean) => void;
}) {
  const { t } = useTranslation(['participants', 'general']);
  const [guestName, setGuestName] = useState('');
  const [avatarStrings, setAvatarStrings] = useState<string[]>([
    createRandomId(),
  ]);
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [collectionIndex, setCollectionIndex] = useState(0);
  const currentAvatarString = avatarStrings[avatarIndex];
  const selectedCollectionName = collectionNames[collectionIndex];

  function handlePrevAvatar() {
    if (avatarIndex > 0) {
      setAvatarIndex(avatarIndex - 1);
    }
  }

  function handleNextAvatar() {
    if (avatarIndex < avatarStrings.length - 1) {
      setAvatarIndex(avatarIndex + 1);
    } else {
      const newId = createRandomId();
      setAvatarStrings((prev) => [...prev, newId]);
      setAvatarIndex((prev) => prev + 1);
    }
  }

  function goToPreviousCollection() {
    setCollectionIndex((prevIndex) => {
      const total = avatarCollections.length;
      return (prevIndex - 1 + total) % total;
    });
  }

  function goToNextCollection() {
    setCollectionIndex(
      (prevIndex) => (prevIndex + 1) % avatarCollections.length
    );
  }

  function handlePlay() {
    if (!guestName) {
      setShowError(true);
      return;
    }
    onSubmit(guestName, currentAvatarString, selectedCollectionName);
  }

  return (
    <div className="flex flex-col items-center justify-center w-[250px] space-y-4">
      <div className="flex items-center justify-center">
        <ArrowBigLeft
          className="cursor-pointer mx-2"
          size={50}
          fill="gray"
          visibility={avatarIndex === 0 ? 'hidden' : 'visible'}
          color={avatarIndex === 0 ? 'gray' : 'black'}
          onClick={handlePrevAvatar}
        />
        <Avatar
          avatarString={currentAvatarString}
          collectionName={selectedCollectionName}
          width="6rem"
          height="6rem"
        />
        <ArrowBigRight
          className="cursor-pointer mx-2"
          size={52}
          fill="gray"
          color="black"
          onClick={handleNextAvatar}
        />
      </div>

      <div className="flex items-center justify-center">
        <ArrowBigLeft
          className="cursor-pointer mx-2"
          size={32}
          fill="gray"
          color="black"
          onClick={goToPreviousCollection}
        />
        <p className="w-[70px] text-center font-display select-none text-black text-2xl">
          {t(`general:${selectedCollectionName}`)}
        </p>
        <ArrowBigRight
          className="cursor-pointer mx-2"
          size={32}
          fill="gray"
          color="black"
          onClick={goToNextCollection}
        />
      </div>

      <Input
        placeholder={t('participants:enter')}
        className={`text-[#333333] text-center font-display md:text-2xl text-2xl py-8 px-12 w-full shadow-lg ${
          showError && 'border-red-500 animate-shake'
        }`}
        value={guestName}
        onChange={(e) => {
          setGuestName(e.target.value);
          setShowError(false);
        }}
        maxLength={15}
      />
      {showError && (
        <div className="flex justify-start items-center w-full text-red-500">
          <InfoIcon className="w-5 h-5 mr-1" />
          <p className="font-display">{t('participants:nameError')}</p>
        </div>
      )}

      <Button
        onClick={handlePlay}
        disabled={isSubmitting}
        isInteractive
        interactiveStyles="w-full"
        className="bg-green-500 text-3xl text-[#fefefe] hover:bg-green-300 py-8 px-12 font-display w-full [&_svg]:!size-5"
      >
        {t('participants:play')}
        <Play strokeWidth={4} />
      </Button>
    </div>
  );
}

function UserView({
  user,
  onSubmit,
  isSubmitting,
}: {
  user: {
    username: string;
    avatar: string;
    collectionName: string;
  };
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const { t } = useTranslation(['participants']);

  return (
    <div className="flex flex-col items-center justify-center w-[250px] space-y-4">
      <Avatar avatarString={user.avatar} collectionName={user.collectionName} />
      <Input
        disabled
        className="text-[#333333] text-center font-display md:text-lg text-lg py-8 px-12 w-full shadow-lg"
        value={user.username}
      />
      <Button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="bg-green-500 text-3xl text-[#fefefe] hover:bg-green-300 py-8 px-12 font-display w-full [&_svg]:!size-5"
      >
        {t('play')}
        <Play strokeWidth={4} />
      </Button>
    </div>
  );
}

export default function CreateParticipant({
  handleAddParticipant,
}: CreateParticipantProps) {
  const { user: authenticatedUser } = useGetAuthenticatedUser();
  const { t } = useTranslation(['participants']);

  const [showError, setShowError] = useState(false);
  const [user, setUser] = useState<{
    username: string;
    avatar: string;
    collectionName: string;
    isLoggedIn: boolean;
  }>({
    username: '',
    avatar: '',
    isLoggedIn: false,
    collectionName: '',
  });
  const [addingUser, setAddingUser] = useState(false);
  const [activeTab, setActiveTab] = useState('guest');

  // On mount, check if we have a DB user
  useEffect(() => {
    async function initializeUser() {
      if (!authenticatedUser?.id || !authenticatedUser?.email) return;

      try {
        const { data, error } = await userService.findOrCreate(
          authenticatedUser.id,
          authenticatedUser.email
        );
        if (error) {
          console.error('Error in findOrCreate:', error);
          return;
        }
        if (data) {
          console.log('Fetched user from DB:', data);
          setUser({
            username: data.username || '',
            avatar: data.avatar || createRandomId(),
            isLoggedIn: true,
            collectionName: data.collectionName,
          });
          setActiveTab('me');
        }
      } catch (error) {
        console.error('Failed to initialize user:', error);
      }
    }
    initializeUser();
  }, [authenticatedUser]);

  // Called after user picks "Play" as them
  const handleSubmitMe = () => {
    if (!user.username) {
      setShowError(true);
      return;
    }

    if (addingUser) return;

    setAddingUser(true);
    handleAddParticipant(user.username, user.avatar, user.collectionName);

    setTimeout(() => {
      setAddingUser(false);
    }, 1000);
  };

  const handleSubmitGuest = (
    name: string,
    avatar: string,
    collection: string
  ) => {
    if (!name) {
      setShowError(true);
      return;
    }
    if (addingUser) return;

    setAddingUser(true);
    handleAddParticipant(name, avatar, collection);

    setTimeout(() => {
      setAddingUser(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <LanguageToggle />

      {user.isLoggedIn ? (
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val)}>
          <div className="bg-component-background mx-auto rounded-lg flex flex-col items-center justify-center p-6">
            <TabsList className="flex-1 w-full pt-4 pb-8 rounded-lg">
              <TabsTrigger className="bg-white rounded w-full" value="me">
                {t('playAsUser')} {user.username}
              </TabsTrigger>
              <TabsTrigger className="bg-white rounded w-full" value="guest">
                {t('playAsGuest')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="me">
              <UserView
                user={user}
                isSubmitting={addingUser}
                onSubmit={handleSubmitMe}
              />
            </TabsContent>
            <TabsContent value="guest">
              <GuestAdvancedView
                onSubmit={handleSubmitGuest}
                isSubmitting={addingUser}
                showError={showError}
                setShowError={setShowError}
              />
            </TabsContent>
          </div>
        </Tabs>
      ) : (
        <div className="bg-component-background mx-auto rounded-lg flex flex-col items-center justify-center p-6">
          <GuestAdvancedView
            onSubmit={handleSubmitGuest}
            isSubmitting={addingUser}
            showError={showError}
            setShowError={setShowError}
          />
        </div>
      )}
    </div>
  );
}
