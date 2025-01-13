import DOMPurify from 'dompurify';
import { createAvatar } from '@dicebear/core';
import { avatarCollections, collectionNames } from '@/utils'; // Assuming these are already defined¨

interface AvatarProps {
  avatarString: string;
  collectionName?: string;
  width?: string;
  height?: string;
  // Add className prop to control conditional behavior
}

// Function to find the corresponding collection style based on the collection name
export const findCollectionByName = (name: string) => {
  const collectionIndex = collectionNames.indexOf(name);
  if (collectionIndex !== -1) {
    return avatarCollections[collectionIndex];
  }
  return avatarCollections[2]; //Collection with index 2 is "micah"
};

export const findCollectionIndexByName = (name: string) => {
  const collectionIndex = collectionNames.indexOf(name);
  return collectionIndex !== -1 ? collectionIndex : null; // Returns the index or null if not found
};

const Avatar = ({
  avatarString,
  collectionName = 'micah',
  width,
  height,
}: AvatarProps) => {
  // Find the corresponding collection style
  const selectedCollectionStyle = findCollectionByName(collectionName);

  if (!selectedCollectionStyle) {
    console.error('Collection not found');
    return null;
  }

  // Generate the avatar SVG
  const avatar = createAvatar(selectedCollectionStyle, {
    seed: avatarString,
    translateY: 0,
    translateX: 0,
    clip: false,
  });
  const svg = avatar.toString();
  const sanitizedSvg = DOMPurify.sanitize(svg);

  // Conditionally apply transformation for specific class name (e.g., 'adventurer')
  const isAdventurer = collectionName === 'adventurer';

  return (
    <div className="flex flex-col items-center">
      <div
        className="rounded-full overflow-hidden" // Ensures the avatar is clipped to a circle
        style={{ width: width || '8rem', height: height || '8rem' }}
      >
        <div
          className="avatar-svg"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover', // Ensures the SVG covers the container
            transform: isAdventurer ? 'scaleX(-1)' : 'none', // Apply inversion if className is 'adventurer'
          }}
          dangerouslySetInnerHTML={{ __html: sanitizedSvg }}
        />
      </div>
    </div>
  );
};

export default Avatar;
