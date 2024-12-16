import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Check, CircleX } from 'lucide-react';
import { useAppContext } from '@/contexts/App/context';
import { useTranslation } from 'react-i18next';
import { Dices } from 'lucide-react';
import { avatarCollections, collectionNames } from '@/utils'; // Import the collections and names
import Avatar from '@/Avatar'; // Import the Avatar component

function makeid(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function Profile() {
  const {
    user: { user, updateUser },
  } = useAppContext();
  const { t } = useTranslation();
  const [avatarString, setAvatarString] = useState(user?.avatar || '');
  const [username, setUsername] = useState(user?.username || '');
  const [updateStatus, setUpdateStatus] = useState<'success' | 'error' | null>(
    null
  );
  const [statusMessage, setStatusMessage] = useState('');

  // Track the selected collection index
  const [collectionIndex, setCollectionIndex] = useState(0);

  useEffect(() => {
    if (!user) return;
    setAvatarString(user.avatar || '');
    setUsername(user.username || '');
  }, [user]);

  const changeAvatarClick = () => {
    setAvatarString(makeid(10)); // Generate a new random avatar string
    setUpdateStatus(null);
  };

  const handleUpdate = async () => {
    if (!user || !user.id) return;

    const updatedUser = {
      ...user,
      username,
      avatar: avatarString,
      collectionName: collectionNames[collectionIndex], // Store the name of the collection in the DB
    };

    try {
      await updateUser(updatedUser);
      setUpdateStatus('success');
      setStatusMessage('Profile updated!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      setUpdateStatus('error');
      setStatusMessage('Something went wrong. Please try again.');
    }
  };

  // Navigate forward in the collections list
  const goToNextCollection = () => {
    setCollectionIndex(
      (prevIndex) => (prevIndex + 1) % avatarCollections.length
    );
  };

  // Navigate backward in the collections list
  const goToPreviousCollection = () => {
    setCollectionIndex((prevIndex) => {
      const totalCollections = avatarCollections.length;
      return (prevIndex - 1 + totalCollections) % totalCollections; // Handles negative indices
    });
  };

  // Get the currently selected collection style

  const selectedCollectionName = collectionNames[collectionIndex];

  return (
    <div className="flex-1 w-full flex-col flex items-center justify-center overflow-hidden">
      <h1 className="mt-5 font-display text-3xl mb-5">
        {t('general:profile')}
      </h1>
      <Card className="mb-10">
        <CardContent className="flex flex-col items-center gap-4 py-6">
          {/* Use the Avatar component */}
          <Avatar
            avatarString={avatarString}
            collectionName={selectedCollectionName}
          />

          <div>
            <Button onClick={changeAvatarClick} className="mx-5">
              <Dices className="size-20" />
              {t('general:randomize')}
            </Button>
            <Button onClick={goToPreviousCollection} className="mx-5">
              Previous Collection
            </Button>
            <Button onClick={goToNextCollection} className="mx-5">
              Next Collection
            </Button>
          </div>

          <Input
            placeholder={t('general:username')}
            className="text-[#333333] text-center border-gray-400 rounded-md font-display text-lg md:text-lg py-8 px-12 w-full shadow-lg"
            value={username}
            maxLength={15}
            onChange={(e) => {
              setUsername(e.target.value);
              setUpdateStatus(null);
            }}
          />
          <Button onClick={handleUpdate} className="w-full h-12 bg-green-500">
            {t('general:update')}
          </Button>

          {updateStatus && (
            <div className="mt-4 flex flex-col items-center justify-center h-full">
              {updateStatus === 'success' ? (
                <div className="flex flex-col items-center justify-center">
                  <Check className="mr-4 text-green-500 size-20" />
                  <p className="font-display mt-2 text-2xl">{statusMessage}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <CircleX className="text-red-500 size-20" />
                  <p className="font-display mt-2 text-lg">{statusMessage}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Profile;
