import { Participant } from '@/models/Quiz';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { Users } from 'lucide-react';
import { useState } from 'react';
import Avatar, { genConfig } from 'react-nice-avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ParticipantAnswers({
  participants = [],
  removeParticipant,
}: {
  participants: Participant[];
  removeParticipant: (participantId: string) => void;
}) {
  const noParticipants = participants.length;
  const noAnswers = participants.filter(
    (participant) => participant.hasAnswered
  ).length;
  const [isOpen, setIsOpen] = useState(false);
  const [participantToRemove, setParticipantToRemove] = useState<Participant | null>(null);

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="absolute right top-10 right-10 flex justify-center items-center w-44 h-24 rounded-2xl border bg-primary text-white space-x-4">
            <div className="text-center font-display">
              <h1 className="text-4xl">
                {noAnswers} / {noParticipants}
              </h1>
            </div>
            <Users size={48} />
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <div className="bg-white p-4 rounded shadow-lg text-black">
            <h1 className="text-lg font-display">Participants</h1>
            {participants.map((participant) => (
              <div
                key={participant.participantId}
                className="flex flex-row items-center text-lg font-display space-x-1 cursor-pointer hover:bg-gray-100 p-1 rounded"
                onClick={() => {
                  setParticipantToRemove(participant);
                  setIsOpen(false);
                }}
                role="button"
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

      <Dialog open={!!participantToRemove} onOpenChange={() => setParticipantToRemove(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Participant</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {participantToRemove?.name} from the game?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setParticipantToRemove(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (participantToRemove) {
                  removeParticipant(participantToRemove.participantId);
                }
                setParticipantToRemove(null);
              }}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
