import { Participant } from '@/models/Quiz';
import Avatar from '@/Avatar';

export default function ParticipantCard({
  participant,
}: {
  participant: Participant;
}) {
  return (
    <div className="flex items-center gap-2 bg-black/30 p-2 rounded-lg cursor-move">
      <Avatar
        avatarString={participant.avatar}
        collectionName={participant.collectionName}
        width="2rem"
        height="2em"
      />
      <span className="text-sm font-display">{participant.name}</span>
    </div>
  );
}
