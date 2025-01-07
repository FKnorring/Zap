import { motion } from 'framer-motion';
import Avatar from '@/Avatar';
import { useTranslation } from 'react-i18next';

interface AvatarData {
  avatarString: string;
  collectionName: string;
}

interface AvatarCarouselProps {
  avatars: AvatarData[];
}

const AvatarCarousel: React.FC<AvatarCarouselProps> = ({ avatars }) => {
  const { t } = useTranslation();
  return (
    <div className="w-full flex flex-col items-center text-center text-gray-800 bg-[#F4F4F4] py-10">
      <h1 className="font-display lg:text-4xl text-2xl mb-6">
        {t('homepage:avatarText')}
      </h1>
      <div className="relative overflow-hidden w-full">
        <motion.div
          className="flex space-x-4 sm:space-x-8 w-full"
          animate={{ x: ['0%', '-100%'] }}
          transition={{
            repeat: Infinity,
            duration: 300, // Control scroll speed
            ease: 'linear',
          }}
        >
          {/* Map the avatar list twice to create seamless scrolling */}
          {avatars.map((avatar, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Small Screen Avatar (Visible on small screens only) */}
              <div className="lg:hidden">
                <Avatar
                  width="4rem"
                  height="4rem"
                  avatarString={avatar.avatarString}
                  collectionName={avatar.collectionName}
                />
              </div>

              {/* Large Screen Avatar (Visible on large screens only) */}
              <div className="hidden lg:block">
                <Avatar
                  avatarString={avatar.avatarString}
                  collectionName={avatar.collectionName}
                />
              </div>
            </div>
          ))}
          {/* Duplicate the same avatars again for seamless scrolling */}
          {avatars.map((avatar, index) => (
            <div
              key={index + avatars.length}
              className="flex flex-col items-center"
            >
              <div className="lg:hidden">
                <Avatar
                  width="4rem"
                  height="4rem"
                  avatarString={avatar.avatarString}
                  collectionName={avatar.collectionName}
                />
              </div>

              <div className="hidden lg:block">
                <Avatar
                  avatarString={avatar.avatarString}
                  collectionName={avatar.collectionName}
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AvatarCarousel;
