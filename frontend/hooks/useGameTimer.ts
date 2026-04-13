import { useEffect, useRef } from "react";
import { useGameContext } from "@/context/GameContext";

/**
 * Hook que gestiona el temporitzador del joc en temps real.
 *
 * Decrementa `timeRemainingSeconds` del GameContext cada segon.
 * S'atura quan arriba a 0 (isExpired).
 */
const useGameTimer = () => {
  const { gameState, updateState } = useGameContext();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Llegim el temps restant del GameContext (font única de veritat)
  const timeRemaining = gameState.timeRemainingSeconds;
  const isExpired = timeRemaining <= 0;

  // Interval que decrementa 1 segon. S'atura automàticament quan el temps s'esgota.
  // Es recrea cada segon perquè timeRemainingSeconds canvia (dependència del useEffect).
  useEffect(() => {
    if (isExpired) return;

    intervalRef.current = setInterval(() => {
      updateState({
        timeRemainingSeconds: Math.max(0, gameState.timeRemainingSeconds - 1),
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isExpired, gameState.timeRemainingSeconds, updateState]);

  // Formateja el temps restant com MM:SS
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return { timeRemaining, formattedTime, isExpired };
};

export default useGameTimer;
