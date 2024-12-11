import Avatar, { genConfig } from 'react-nice-avatar';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Check, CircleX } from 'lucide-react';
import { useAppContext } from '@/contexts/App/context';
import { useTranslation } from 'react-i18next';
import { Dices } from 'lucide-react';

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
  ); // Track the update status
  const [statusMessage, setStatusMessage] = useState(''); // Store the status message

  useEffect(() => {
    if (!user) return;

    setAvatarString(user.avatar || '');
    setUsername(user.username || '');
  }, [user]);

  const changeAvatarClick = () => {
    setAvatarString(makeid(10)); // Generate a new random avatar strin
    setUpdateStatus(null);
  };

  const handleUpdate = async () => {
    if (!user || !user.id) return;

    const updatedUser = {
      ...user,
      username,
      avatar: avatarString, // Update the avatar field
    };

    try {
      // Try to update the user profile
      await updateUser(updatedUser);
      setUpdateStatus('success'); // If successful
      setStatusMessage('Profile updated!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      setUpdateStatus('error'); // If there's an error
      setStatusMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex-1 w-full flex-col flex items-center justify-center overflow-hidden">
      <h1 className="mt-5 font-display text-3xl mb-5">
        {t('general:profile')}
      </h1>
      <Card className="mb-10">
        <CardContent className="flex flex-col items-center gap-4 py-6">
          <Avatar
            style={{ width: '8rem', height: '8rem' }}
            {...genConfig(avatarString)}
          />
          <div>
            <Button onClick={changeAvatarClick} className="mx-5">
              <Dices className="size-20" />
              {t('general:randomize')}
            </Button>
          </div>

          <Input
            placeholder={t('general:username')}
            className="text-[#333333] text-center border-gray-400 rounded-md font-display text-lg md:text-lg py-8 px-12 w-full shadow-lg"
            value={username}
            maxLength={15}
            onChange={(e) => {
              setUsername(e.target.value);
              setUpdateStatus(null); // Reset the update status whenever the username changes
            }}
          />
          <Button onClick={handleUpdate} className="w-full h-12 bg-green-500">
            {t('general:update')}
          </Button>
          {/* Display the status message and icon */}
          {updateStatus && (
            <div className="mt-4 flex flex-col items-center justify-center h-full">
              {' '}
              {/* Added h-full to fill the height */}
              {updateStatus === 'success' ? (
                <div className="flex flex-col items-center justify-center">
                  {' '}
                  {/* flex-col ensures vertical stacking */}
                  <Check className="mr-4 text-green-500 size-20" />{' '}
                  {/* Icon with margin */}
                  <p className="font-display mt-2 text-2xl">{statusMessage}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  {' '}
                  {/* flex-col ensures vertical stacking */}
                  <CircleX className="text-red-500 size-20" />{' '}
                  {/* Icon with margin */}
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
