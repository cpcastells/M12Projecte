import { useEffect, useRef } from "react";
import { useGameContext } from "@/context/GameContext";

/**
 * Decrementa el timer 1s cada segon client-side. S'atura a 0. El valor es
 * persisteix periòdicament via auto-save del GameProvider.
 */
const useGameTimer = () => {
  const { timeRemainingSeconds, setTimeRemaining } = useGameContext();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeRef = useRef(timeRemainingSeconds);

  useEffect(() => {
    timeRef.current = timeRemainingSeconds;
  }, [timeRemainingSeconds]);

  useEffect(() => {
    if (timeRef.current <= 0) return;

    intervalRef.current = setInterval(() => {
      setTimeRemaining(timeRef.current - 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [setTimeRemaining]);

  const isExpired = timeRemainingSeconds <= 0;
  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return { timeRemaining: timeRemainingSeconds, formattedTime, isExpired };
};

export default useGameTimer;
