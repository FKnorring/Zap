import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { ArrowBigRight, ArrowBigLeft } from 'lucide-react';
import { useAppContext } from '@/contexts/App/context';
import { useTranslation } from 'react-i18next';

import { avatarCollections, collectionNames } from '@/utils'; // Import the collections and names
import Avatar, { findCollectionIndexByName } from '@/Avatar'; // Import the Avatar component
import { Label } from '@/components/ui/label';

function Profile() {
  const {
    user: { user, updateUser },
  } = useAppContext();
  const { t } = useTranslation();
  const [avatarString, setAvatarString] = useState(user?.avatar || '');
  const [avatarStrings, setAvatarStrings] = useState<string[]>(
    user?.avatar ? [user.avatar] : []
  );
  const [username, setUsername] = useState(user?.username || '');
  const [avatarIndex, setAvatarIndex] = useState(0); // To keep track of the current avatar index
  const [collectionIndex, setCollectionIndex] = useState(0);

  useEffect(() => {
    if (!user) return;
    setAvatarString(user.avatar || '');

    setUsername(user.username || '');

    const index = findCollectionIndexByName(user.collectionName);
    if (index !== null) {
      setCollectionIndex(index);
    }
  }, [user]);

  // Function to generate a random avatar ID
  const makeid = (length: number): string => {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  // Right Arrow Click (Next Avatar)
  const rightAvatarChange = () => {
    if (avatarIndex < avatarStrings.length - 1) {
      // Move to the next avatar if within bounds
      setAvatarIndex(avatarIndex + 1);
    } else {
      // If the index goes out of bounds, create a new avatar ID and add it to the list
      const newId = makeid(10);
      setAvatarStrings((prev) => [...prev, newId]);
      setAvatarIndex((prev) => prev + 1); // Set the index to the new avatar
      setAvatarString(newId); // Set the avatar string to the new ID
    }
  };

  // Left Arrow Click (Previous Avatar)
  const leftAvatarChange = () => {
    if (avatarIndex > 0) {
      // Move to the previous avatar if within bounds
      setAvatarIndex(avatarIndex - 1);
    } else {
      // If the index goes below 0, return to the first avatar instead of generating a new one
      console.warn('You are at the first avatar.');
    }
  };

  // Initialize the avatarStrings array and avatarIndex on load
  useEffect(() => {
    if (user?.avatar) {
      setAvatarStrings([user.avatar]); // Ensure the user's avatar is the initial value
      setAvatarIndex(0); // Start at the first index
    }
  }, [user]);

  // Update the avatar string based on the current index
  const currentAvatarString = avatarStrings[avatarIndex];

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

      toast.success('Profile updated!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Something went wrong');
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
    <div className="rounded-lg flex w-full flex-col items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center gap-3 py-4">
        {/* Use the Avatar component */}
        <div className="flex-1 h-[200px] w-full flex items-center justify-center">
          <ArrowBigLeft
            fill="grey"
            size={'48'}
            onClick={leftAvatarChange}
            className="cursor-pointer"
          ></ArrowBigLeft>
          <Avatar
            avatarString={currentAvatarString}
            collectionName={selectedCollectionName}
            width="5rem"
            height="5rem"
          />
          <ArrowBigRight
            fill="gray"
            size={'48'}
            onClick={rightAvatarChange}
            className="cursor-pointer"
          ></ArrowBigRight>
        </div>

        <div className="flex-1 w-full flex-row flex items-center justify-center">
          <ArrowBigLeft
            fill="gray"
            size={'40'}
            onClick={goToPreviousCollection}
            className=" left-8 cursor-pointer"
          ></ArrowBigLeft>
          <h1 className="w-[70px] text-center font-display select-none">
            {t('general:' + selectedCollectionName)}
          </h1>
          <ArrowBigRight
            fill="gray"
            size={'40'}
            onClick={goToNextCollection}
            className=" cursor-pointer"
          ></ArrowBigRight>
        </div>

        <div className="grid w-full items-center justify-center  gap-1">
          <Label htmlFor="username">{t('general:username')}</Label>
          <Input
            placeholder={t('general:username')}
            className="text-[#333333] text-center w-[160px] border-gray-400 rounded-md font-display text-lg md:text-lg shadow-lg"
            value={username}
            id="username"
            maxLength={15}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>

        <Button onClick={handleUpdate} className="font-display w-[160px]">
          {t('general:update')}
        </Button>
      </div>
    </div>
  );
}

export default Profile;
