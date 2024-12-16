import { Participant } from "@/models/Quiz";
import Avatar, { genConfig } from "react-nice-avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Participants({ participants, removeParticipant }: { participants: Participant[], removeParticipant: (participantId: string) => void }) {
  const [participantToRemove, setParticipantToRemove] = useState<Participant | null>(null);

  return (
    <>
      {Object.values(participants).map((participant, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center p-4 rounded-lg animate-[zoom-in_1s_ease-in-out] min-w-36 w-36 max-w-36"
          onClick={() => setParticipantToRemove(participant)}
          role="button"
        >
          <Avatar
            style={{ width: "4.5rem", height: "4.5rem" }}
            {...genConfig(participant.avatar ? participant.avatar : "")}
          />
          <span className="text-2xl font-display truncate mt-2 bg-white text-black px-3 py-1 rounded max-w-32">
            {participant.name}
          </span>
        </div>
      ))}

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
