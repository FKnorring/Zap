import { useState, useEffect } from "react";
import { Participant } from "@/models/Quiz";
import Avatar, { genConfig } from "react-nice-avatar";
import { motion, AnimatePresence } from "framer-motion";
import { HeartIcon } from "lucide-react";

type BombTimerProps = {
  initialTime: number;
  participants: Participant[];
};

const BombTimer = ({ initialTime, participants }: BombTimerProps) => {
  const [time, setTime] = useState(initialTime);
  const [currentParticipants, setCurrentParticipants] = useState(participants);
  const [participantHearts, setParticipantHearts] = useState(
    Object.fromEntries(participants.map((p) => [p.name, 3]))
  );
  const [winner, setWinner] = useState<Participant | null>(null);

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
      if (e.key === "x") {
        setCurrentParticipants((prevParticipants) => {
          const totalParticipants = prevParticipants.length;
          const currentIndex = 0; // Big avatar is always the first participant
          const nextIndex = getNextParticipantIndex((currentIndex + 1) % totalParticipants);

          // Reorganize participants array based on the new first participant
          return [...prevParticipants.slice(nextIndex), ...prevParticipants.slice(0, nextIndex)];
        });
        setTime(initialTime); // Reset the timer
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [initialTime, participantHearts]);

  // Handle timer reaching 0
  useEffect(() => {
    if (time === 0) {
      const currentPlayer = currentParticipants[0].name;

      // Decrease heart count
      setParticipantHearts((prevHearts) => {
        const updatedHearts = { ...prevHearts };
        updatedHearts[currentPlayer] = Math.max(0, updatedHearts[currentPlayer] - 1);

        return updatedHearts;
      });

      // Skip to the next participant if current has no hearts
      setCurrentParticipants((prevParticipants) => {
        const nextIndex = getNextParticipantIndex(1); // Find the next valid participant
        return [...prevParticipants.slice(nextIndex), ...prevParticipants.slice(0, nextIndex)];
      });

      setTime(initialTime); // Reset timer
    }
  }, [time, currentParticipants, initialTime, participantHearts]);

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
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          textAlign: "center",
        }}
      >
        <h1 className="font-display text-6xl">Winner is {winner.name}!</h1>
        <Avatar
          style={{
            width: "12rem",
            height: "12rem",
          }}
          {...genConfig(winner.avatar)}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
      }}
    >
      {/* Timer */}
      <div className="font-display text-5xl" style={{ textAlign: "center" }}>
        {time}
      </div>

      {/* Big Avatar */}
      <div>
        <AnimatePresence mode="wait">
          {currentParticipants[0] && participantHearts[currentParticipants[0].name] > 0 && (
            <motion.div
              key={currentParticipants[0].name}
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: "0%" }}
              exit={{ opacity: 0, y: "+100%" }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                zIndex: 2,
              }}
            >
              <div
  style={{
    display: "flex",
    flexDirection: "row", // Places avatar and text side by side
    alignItems: "center", // Centers avatar vertically
    gap: "1rem", // Adds spacing between the avatar and text
  }}
>
  <Avatar
    style={{
      width: "12rem",
      height: "12rem",
    }}
    {...genConfig(currentParticipants[0].avatar)}
  />
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center", // Adjusts text to align properly with avatar
    }}
  >
    <h2 style={{ margin: 0 }}>Text</h2>
  </div>
</div>

                        
              <h3 className="font-display">{currentParticipants[0].name}</h3>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {Array.from({ length: participantHearts[currentParticipants[0].name] || 0 }).map((_, index) => (
                  <HeartIcon key={index} fill="#FF4545" color="#FF4545" />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Avatar Row */}
      <motion.div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
          width: "100%",
          padding: "1rem 2rem",
          overflow: "hidden",
        }}
      >
        {currentParticipants.map((participant) => (
          <motion.div
            key={participant.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              filter: participantHearts[participant.name] > 0 ? "none" : "grayscale(100%)",
            }}
          >
            <Avatar
              style={{
                width: "8rem",
                height: "8rem",
              }}
              {...genConfig(participant.avatar)}
            />
            <h3 className="font-display">{participant.name}</h3>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {participantHearts[participant.name] > 0 ? (
                Array.from({ length: participantHearts[participant.name] }).map((_, index) => (
                  <HeartIcon key={index} fill="#FF4545" color="#FF4545" />
                ))
              ) : (
                <span style={{ fontSize: "1.5rem" }}>💀</span>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default BombTimer;