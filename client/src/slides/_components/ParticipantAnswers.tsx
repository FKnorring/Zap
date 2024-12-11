import { Participant } from '@/models/Quiz';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { Users } from 'lucide-react';
import { useState } from 'react';
import Avatar, { genConfig } from 'react-nice-avatar';

export function ParticipantAnswers({
  participants = [],
}: {
  participants: Participant[];
}) {
  const noParticipants = participants.length;
  const noAnswers = participants.filter(
    (participant) => participant.hasAnswered
  ).length;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="absolute top-4 right-4 flex justify-center items-center w-44 h-24 rounded-2xl border bg-primary text-white space-x-4">
          <div className="text-center font-display">
            <h1 className="text-4xl">
              {noAnswers} / {noParticipants}
            </h1>
          </div>
          <Users size={48} />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="position-relative bg-white p-4 rounded shadow-lg text-black">
          <h1 className="text-lg font-display ">Participants</h1>
          {participants.map((participant) => (
            <div
              key={participant.participantId}
              className="flex flex-row items-center text-lg font-display space-x-1"
            >
              <Avatar
                style={{
                  width: '22px',
                  height: '22px',
                }}
                {...genConfig(participant.avatar)}
              />
              {participant.name} -{' '}
              {participant.hasAnswered ? 'Answered' : 'Not Answered'}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
