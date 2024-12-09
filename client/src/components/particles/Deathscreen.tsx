import React, { useEffect, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { IOptions, RecursivePartial, MoveDirection } from "@tsparticles/engine";

interface ParticleScreenProps {
  isExploded: boolean;
  showMessage: boolean;
  participants: { name: string }[];
}

const DeathScreen = ({ isExploded, showMessage, participants }: ParticleScreenProps) => {
  const [init, setInit] = React.useState(false);

  // Initialize particles engine on mount
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });

  }, []); // Only initialize once when the component is mounted

  const particlesOptions: RecursivePartial<IOptions> = useMemo(
    () => ({
      background: {
        color: {
          value: "#000000", // Dark background for explosion effect
        },
      },
      fpsLimit: 120,
      particles: {
        color: {
          value: ["#ff0000", "#ff9900", "#ffff00"], // Red, orange, yellow particles
        },
        move: {
          enable: true,
          speed: isExploded ? 150 : 0, // Explosive speed
          direction: MoveDirection.none, // Random outward directions
          random: true,
          straight: false,
          outModes: { default: "destroy" }, // Particles disappear outside canvas
        },
        number: {
          value: isExploded ? 500 : 0, // Show many particles for the explosion
        },
        size: {
          value: { min: 5, max: 20 }, // Larger particles for dramatic effect
        },
        opacity: {
          value: 1,
          animation: {
            enable: true,
            startValue: "random",
            minimumValue: 0,
            speed: 1,
            destroy: "none",
          },
        },
        shape: {
          type: "circle",
        },
        life: {
          duration: {
            sync: true,
            value: 3, // Particles last 3 seconds
          },
          count: 1,
        },
      },
      emitters: {
        position: {
          x: 50, // Exact center horizontally (percentage)
          y: 50, // Exact center vertically (percentage)
        },
        rate: {
          delay: 0,
          quantity: isExploded ? 2000 : 0, // Emit all particles instantly on explosion
        },
        size: {
          width: 0, // Emitter size is zero for point emission
          height: 0,
        },
      },
      detectRetina: true,
    }),
    [isExploded]
  );

  return (
    <div
      id="tsparticles"
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        zIndex: isExploded ? 1 : -1,
      }}
    >
      {init && (
        <>
          <Particles
            key={isExploded ? "exploded" : "default"}
            options={particlesOptions}
          />
          {showMessage && (
            <h1
              className="font-display"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "white",
                fontSize: "50px",
                fontWeight: "bold",
                zIndex: 10,
              }}
            >
              {participants.map((participant) => participant.name).join(", ")} died 💀
            </h1>
          )}
        </>
      )}
    </div>
  );
};

export default DeathScreen;
