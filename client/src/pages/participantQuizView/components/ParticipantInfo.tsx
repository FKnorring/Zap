import Avatar from '@/Avatar';
import { Participant } from '@/models/Quiz';

interface TeamInfoProps {
  participant: Participant;
}

export default function TeamInfo({ participant }: TeamInfoProps) {
  const totalScore = participant.score.reduce((sum, score) => sum + score, 0);
  return (
    <div className=" fixed bottom-2 left-1/2 transform -translate-x-1/2 bg-white text-[#333333] flex justify-between items-center p-2 w-[90%] max-w-xl rounded-lg shadow-md">
      <div className="flex items-center">
        <Avatar
          avatarString={participant.avatar}
          collectionName={participant.collectionName}
          width="3rem"
          height="3rem"
        />
        <h1 className="pl-3 font-display text-3xl">{participant.name}</h1>
      </div>
      <p className="text-3xl font-display pr-2">{totalScore}</p>
    </div>
  );
}
