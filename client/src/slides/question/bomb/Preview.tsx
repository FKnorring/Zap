import { useState, useEffect } from 'react';
import { Participant } from '@/models/Quiz';
import Avatar, { genConfig } from 'react-nice-avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon } from 'lucide-react';
import { BombSlide } from '@/models/Quiz';

const mockParticipants: Participant[] = [
  {
    answers: [
      { slideNumber: 1, answer: ['Yes'], time: '2024-11-18T10:05:00Z' },
      { slideNumber: 2, answer: ['No'], time: '2024-11-18T10:10:00Z' },
    ],
    hasAnswered: true,
    avatar: 'https://example.com/avatar1.png',
    name: 'Alice Johnson',
    participantId: 'P001',
    score: [8, 12],
    tempAnswer: { tempAnswer: 'hej', time: '10.01' },
    
  },
  {
    answers: [
      { slideNumber: 1, answer: ['Maybe'], time: '2024-11-18T10:06:00Z' },
      { slideNumber: 2, answer: ['Yes'], time: '2024-11-18T10:11:00Z' },
    ],
    hasAnswered: true,
    avatar: 'https://example.com/avatar2.png',
    name: 'Bob Smith',
    participantId: 'P002',
    score: [10, 15],
    tempAnswer: { tempAnswer: 'hej', time: '10.01' },
    
  },
  {
    answers: [{ slideNumber: 1, answer: ['No'], time: '2024-11-18T10:07:00Z' }],
    hasAnswered: true,
    avatar: 'https://example.com/avatar3.png',
    name: 'Charlie Brown',
    participantId: 'P003',
    score: [5],
    tempAnswer: { tempAnswer: 'hej', time: '10.01' },
    
  },
  {
    answers: [],
    hasAnswered: false,
    avatar: 'https://example.com/avatar4.png',
    name: 'Diana Prince',
    participantId: 'P004',
    score: [],
    tempAnswer: { tempAnswer: 'hej', time: '10.01' },
    
  },
  {
    answers: [
      { slideNumber: 1, answer: ['Agree'], time: '2024-11-18T10:08:00Z' },
      { slideNumber: 3, answer: ['Disagree'], time: '2024-11-18T10:15:00Z' },
    ],
    hasAnswered: true,
    avatar: 'https://example.com/avatar5.png',
    name: 'Ethan Hunt',
    participantId: 'P005',
    score: [9, 11],
    tempAnswer: { tempAnswer: 'hej', time: '10.01' },
    
  },
];

type PreviewProps = {
  participants: Participant[];
  slide: BombSlide;
};

export function Preview({
  participants = mockParticipants,
  slide,
}: PreviewProps) {
  const [time, setTime] = useState(slide.initialTime || 10);
  const [currentParticipants, setCurrentParticipants] = useState(
    mockParticipants || []
  );
  const [participantHearts, setParticipantHearts] = useState(
    participants
      ? Object.fromEntries(
          participants.map((p) => [p.name, Math.min(slide.hearts || 3, 5)]) // Ensure max hearts are 5
        )
      : {}
  );

  // Sync participantHearts when slide.hearts changes, with max hearts set to 5
  useEffect(() => {
    if (participants) {
      setParticipantHearts(
        Object.fromEntries(
          mockParticipants.map((p) => [p.name, Math.min(slide.hearts || 3, 5)]) // Ensure max hearts are 5
        )
      );
    }
  }, [slide.hearts, mockParticipants]);
  const [winner, setWinner] = useState<Participant | null>(null);

  if (currentParticipants.length === 0) {
    return <div>No participants available</div>;
  }

  const currentPlayer = currentParticipants[0];
  if (!currentPlayer || !(currentPlayer.name in participantHearts)) {
    console.log('Currentparticipants', currentParticipants);
    return <div>Invalid participant data</div>;
  }

  // Countdown effect
  useEffect(() => {
    if (time <= 0) return;

    const timer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  // Utility function to skip participants with no hearts
  const getNextParticipantIndex = (startIndex: number): number => {
    const totalParticipants = currentParticipants.length;
    let index = startIndex;

    while (participantHearts[currentParticipants[index].name] <= 0) {
      index = (index + 1) % totalParticipants;
      if (index === startIndex) break; // Prevent infinite loop if all participants are dead
    }

    return index;
  };

  // Rotate participants on "x" key press
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'x') {
        setCurrentParticipants((prevParticipants) => {
          const totalParticipants = prevParticipants.length;
          const currentIndex = 0; // Big avatar is always the first participant
          const nextIndex = getNextParticipantIndex(
            (currentIndex + 1) % totalParticipants
          );

          // Reorganize participants array based on the new first participant
          return [
            ...prevParticipants.slice(nextIndex),
            ...prevParticipants.slice(0, nextIndex),
          ];
        });
        setTime(slide.initialTime); // Reset the timer
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [slide.initialTime, participantHearts]);

  // Handle timer reaching 0
  useEffect(() => {
    if (time === 0) {
      const currentPlayer = currentParticipants[0].name;

      // Decrease heart count
      setParticipantHearts((prevHearts) => {
        const updatedHearts = { ...prevHearts };
        updatedHearts[currentPlayer] = Math.max(
          0,
          updatedHearts[currentPlayer] - 1
        );

        return updatedHearts;
      });

      // Skip to the next participant if current has no hearts
      setCurrentParticipants((prevParticipants) => {
        const nextIndex = getNextParticipantIndex(1); // Find the next valid participant
        return [
          ...prevParticipants.slice(nextIndex),
          ...prevParticipants.slice(0, nextIndex),
        ];
      });

      setTime(slide.initialTime); // Reset timer
    }
  }, [time, currentParticipants, slide.initialTime, participantHearts]);

  // Update alive participants and check for winner
  useEffect(() => {
    // Filter out dead participants (those with 0 hearts)
    const aliveParticipants = currentParticipants.filter(
      (p) => participantHearts[p.name] > 0
    );

    if (aliveParticipants.length === 1) {
      setWinner(aliveParticipants[0]); // Set the winner if only one participant remains with hearts > 0
    }
  }, [currentParticipants, participantHearts]);

  if (winner) {
    // Render the Winner Screen
    return (
      <motion.div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          textAlign: 'center',
        }}
      >
        <h1 className="font-display text-6xl">Winner is {winner.name}!</h1>
        <Avatar
          style={{
            width: '12rem',
            height: '12rem',
          }}
          {...genConfig(winner.avatar)}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '8rem',
      }}
    >
      <div>
        <div className="gap-4rem mt-4 rounded-lg bg-[#F4F3F2] text-black mb-4 flex justify-center font-display text-4xl items-center w-full">
          <h1 className="p-4">{slide.title}</h1>
        </div>

        <AnimatePresence mode="wait">
          {currentParticipants[0] &&
            participantHearts[currentParticipants[0].name] > 0 && (
              <motion.div
                key={currentParticipants[0].name}
                initial={{ opacity: 0, x: '-100%' }}
                animate={{ opacity: 1, x: '0%' }}
                exit={{ opacity: 0, y: '+100%' }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  zIndex: 2,
                }}
              >
                <div className=" grid grid-cols-2 gap-4">
                  {/* Timer stays in the first column */}
                  <div className="flex-col justify-center items-center font-display ">
                    <h2 className="text-5xl">{time}</h2>
                    <div className="mt-4 text-4xl">
                      <h3 className="font-display">
                        {currentParticipants[0].name}
                      </h3>
                    </div>
                    <div className=" mt-4 justify-center items center flex gap-0.5rem">
                      {Array.from({
                        length:
                          participantHearts[currentParticipants[0].name] || 0,
                      }).map((_, index) => (
                        <HeartIcon key={index} fill="#FF4545" color="#FF4545" />
                      ))}
                    </div>
                  </div>

                  {/* Avatar stays in the second column, center aligned */}
                  <motion.div
                    className="flex flex-col items-center justify-center"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                  >
                    <Avatar
                      style={{
                        width: '8rem',
                        height: '8rem',
                      }}
                      {...genConfig(currentParticipants[0].avatar)}
                    />
                  </motion.div>

                  {/* Name and Hearts placed under the timer in the first column */}
                  <div className="flex flex-col items-center justify-center col-span-1"></div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="bg-white p-2 px-4 rounded-md   text-black font-display text-2xl"></div>
                </div>
              </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Avatar Row */}
      <motion.div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '4rem',
          width: '100%',
          padding: '1rem 2rem',
          overflow: 'hidden',
        }}
      >
        {currentParticipants.map((participant) => (
          <motion.div
            key={participant.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              filter:
                participantHearts[participant.name] > 0
                  ? 'none'
                  : 'grayscale(100%)',
            }}
          >
            <Avatar
              style={{
                width: '6rem',
                height: '6rem',
              }}
              {...genConfig(participant.avatar)}
            />
            <h3 className="font-display">{participant.name}</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {participantHearts[participant.name] > 0 ? (
                Array.from({ length: participantHearts[participant.name] }).map(
                  (_, index) => (
                    <HeartIcon key={index} fill="#FF4545" color="#FF4545" />
                  )
                )
              ) : (
                <span style={{ fontSize: '1.5rem' }}>💀</span>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default Preview;
