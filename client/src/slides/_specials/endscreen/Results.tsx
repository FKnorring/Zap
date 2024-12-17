import { Participant, ParticipantAnswer, TempAnswer } from '@/models/Quiz';
import Avatar from '@/Avatar';
import { Ellipsis } from 'lucide-react';

interface ParticipantTotal {
  total: number;
  answers: Array<ParticipantAnswer>;
  tempAnswer?: TempAnswer;
  hasAnswered: boolean;
  avatar: string;
  collectionName: string;
  name: string;
  participantId: string;
  score: number[];
}

const DisplayPlacement = ({
  participants,
}: {
  participants: ParticipantTotal[];
}) => {
  const size =
    participants.length === 1
      ? '8rem'
      : participants.length === 2
        ? '4rem'
        : '2rem';

  const textSize =
    participants.length === 1
      ? 'text-4xl'
      : participants.length === 2
        ? 'text-3xl'
        : 'text-2xl';
  return (
    <div className="flex flex-row gap-8 items-center justify-center">
      {participants.slice(0, 3).map((participant) => (
        <div
          key={participant.participantId}
          className="flex flex-col items-center"
        >
          <Avatar
            width={size}
            height={size}
            avatarString={participant.avatar}
            collectionName={participant.collectionName}
          ></Avatar>
          <div className="flex flex-col items-center">
            <span className={`font-display ${textSize}`}>
              {participant.name}
            </span>
          </div>
        </div>
      ))}
      {participants.length > 3 && (
        <Ellipsis className="items-start self-center justify-start w-12 h-12" />
      )}
    </div>
  );
};

export default function Results({
  participants,
}: {
  participants: Participant[];
}) {
  const participantsWithTotal = participants
    .map((participant) => ({
      ...participant,
      total: participant.score.reduce((acc, curr) => acc + curr, 0),
    }))
    .sort((a, b) => b.total - a.total);

  const getTopThree = (
    participants: ParticipantTotal[]
  ): ParticipantTotal[][] => {
    if (participants.length === 0) return [[], [], [], []];

    // Create lists for first, second, and third places
    const result: ParticipantTotal[][] = [[], [], [], []];
    let currentRank = 0;
    let lastValue = null;

    for (const participant of participants) {
      if (currentRank > 3) {
        result[3].push(participant);
      }

      // If the score changes, move to the next rank
      if (participant.total !== lastValue) {
        currentRank++;
        lastValue = participant.total;
      }

      // Add the participant to the correct rank list
      if (currentRank <= 3) {
        result[currentRank - 1].push(participant);
      }
    }

    return result;
  };

  // Returns a list with a list of the placements
  const placement = getTopThree(participantsWithTotal);

  const firstPlace = placement[0];

  const secondPlace = placement[1];

  const thirdPlace = placement[2];
  // Rest of the participants
  const forthPlace = placement[3];
  const showFourthPlace = forthPlace.length > 0;

  return (
    <div className="flex-1 flex flex-col">
      {/* Podium Section */}
      <div className="flex-1 flex items-end justify-center gap-10 w-full">
        {/* Second Place */}
        {secondPlace.length > 0 && (
          <div className="flex flex-col items-center">
            <DisplayPlacement participants={secondPlace} />
            <span className="font-semibold text-3xl text-gray-600">
              {secondPlace[0].total} pts
            </span>
            <div className="w-32 bg-silver h-40 rounded-t-lg flex items-center justify-center text-4xl font-bold font-display">
              2
            </div>
          </div>
        )}

        {/* First Place */}
        {firstPlace.length > 0 && (
          <div className="flex flex-col items-center">
            <DisplayPlacement participants={firstPlace} />
            <span className="font-semibold text-3xl text-gray-600">
              {firstPlace[0].total} pts
            </span>
            <div className="w-32 bg-gold h-52 rounded-t-lg flex items-center justify-center text-5xl font-bold font-display">
              1
            </div>
          </div>
        )}

        {/* Third Place */}
        {thirdPlace.length > 0 && (
          <div className="flex flex-col items-center">
            <DisplayPlacement participants={thirdPlace} />
            <span className="font-semibold text-3xl text-gray-600">
              {thirdPlace[0].total} pts
            </span>
            <div className="w-32 bg-bronze h-24 rounded-t-lg flex items-center justify-center text-4xl font-bold font-display">
              3
            </div>
          </div>
        )}
      </div>

      {/* Rest of Participants List */}
      {showFourthPlace && (
        <div className="flex-1 w-full max-w-4xl mx-auto overflow-y-auto max-h-80 border rounded-lg">
          {forthPlace.map((participant, index) => (
            <div
              key={participant.name}
              className="flex items-center gap-4 p-3 border-b last:border-b-0"
            >
              <span className="font-semibold w-8">{index + 4}.</span>
              <Avatar
                width={"4rem"}
                height={'4rem'}
                avatarString={participant.avatar}
                collectionName={participant.collectionName}
              ></Avatar>
              <span className="flex-grow text-2xl font-semibold">
                {participant.name}
              </span>
              <span className="font-semibold text-2xl">
                {participant.total} pts
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
