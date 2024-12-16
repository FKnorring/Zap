import { useState, useEffect } from 'react';
import { useInitParticles } from './useParticles';
import { Particles } from '@tsparticles/react';

export function Confetti({ delayProp = 0 }: { delayProp?: number }) {
  const [showConfetti, setShowConfetti] = useState(false); // Control visibility
  const init = useInitParticles();

  useEffect(() => {
    const delay = delayProp; // Delay in milliseconds (e.g., 2 seconds)
    const timer = setTimeout(() => {
      setShowConfetti(true); // Show Confetti after delay
    }, delay);

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, []);

  if (!init || !showConfetti) return null;

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-50 w-svw h-dvh pointer-events-none">
      <Particles
        className="w-full h-full"
        options={{
          fullScreen: {
            zIndex: 1,
          },
          particles: {
            number: {
              value: 0,
            },
            color: {
              value: ['#00FFFC', '#FC00FF', '#fffc00'],
            },
            shape: {
              type: 'emoji',
              options: {
                emoji: {
                  particles: {
                    size: {
                      value: 10,
                    },
                  },
                  value: ['🎯', '💥', '🍀', '🎉', '🦄', '⭐️', '🎈'],
                },
              },
            },
            opacity: {
              value: {
                min: 0,
                max: 1,
              },
              animation: {
                enable: true,
                speed: 1,
                startValue: 'max',
                destroy: 'min',
              },
            },
            size: {
              value: {
                min: 2,
                max: 8,
              },
            },
            links: {
              enable: false,
            },
            life: {
              duration: {
                sync: true,
                value: 5,
              },
              count: 1,
            },
            move: {
              enable: true,
              gravity: {
                enable: true,
                acceleration: 10,
              },
              speed: {
                min: 10,
                max: 70,
              },
              decay: 0.07,
              direction: 'none',
              straight: false,
              outModes: {
                default: 'destroy',
                top: 'none',
              },
            },
            rotate: {
              value: {
                min: 0,
                max: 360,
              },
              direction: 'random',
              move: true,
              animation: {
                enable: true,
                speed: 60,
              },
            },
            tilt: {
              direction: 'random',
              enable: true,
              move: true,
              value: {
                min: 0,
                max: 360,
              },
              animation: {
                enable: true,
                speed: 60,
              },
            },
            roll: {
              darken: {
                enable: true,
                value: 25,
              },
              enable: true,
              speed: {
                min: 15,
                max: 25,
              },
            },
            wobble: {
              distance: 30,
              enable: true,
              move: true,
              speed: {
                min: -15,
                max: 15,
              },
            },
          },
          emitters: {
            life: {
              count: 1,
              duration: 0.1,
              delay: 0.6,
            },
            rate: {
              delay: 0.2,
              quantity: 200,
            },
            size: {
              width: 1,
              height: 1,
            },
            position: {
              y: 30,
              x: 50,
            },
          },
        }}
      />
    </div>
  );
}
