import React, { useEffect, useRef } from "react";
import NoSleep from "nosleep.js";

const NoSleepComponent: React.FC = () => {
  const noSleepRef = useRef<NoSleep | null>(null);

  useEffect(() => {
    noSleepRef.current = new NoSleep();

    const enableNoSleep = async () => {
      try {
        // Attempt to enable NoSleep immediately
        await noSleepRef.current?.enable();
        console.log("NoSleep is enabled on load");
      } catch {
        console.log("NoSleep requires user interaction");
        // Fallback: listen for user interaction to enable NoSleep
        document.addEventListener("click", handleUserInteraction);
      }
    };

    const handleUserInteraction = () => {
      noSleepRef.current?.enable();
      console.log("NoSleep is enabled after user interaction");
      document.removeEventListener("click", handleUserInteraction);
    };

    enableNoSleep();

    return () => {
      noSleepRef.current?.disable();
      console.log("NoSleep is disabled");
    };
  }, []);

  return null; // This component doesn't render anything.
};

export default NoSleepComponent;
