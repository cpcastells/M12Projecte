"use client";

import { useEffect } from "react";
import { useGameContext } from "@/context/GameContext";
import { socket } from "@/services/socket";

/**
 * Timer controlado por backend via Socket.IO.
 * Si el socket se reconecta, vuelve a unirse automáticamente a la partida.
 */
const useGameTimer = (gameId?: number) => {
  const { timeRemainingSeconds, setTimeRemaining } = useGameContext();

  useEffect(() => {
    if (!gameId) return;

    const joinTimerRoom = () => {
      socket.emit("timer:join", { gameId });
    };

    if (!socket.connected) {
      socket.connect();
    } else {
      joinTimerRoom();
    }

    const handleConnect = () => {
      joinTimerRoom();
    };

    const handleUpdate = (data: { timeRemainingSeconds: number }) => {
      setTimeRemaining(data.timeRemainingSeconds);
    };

    const handleEnded = () => {
      setTimeRemaining(0);
    };

    socket.on("connect", handleConnect);
    socket.on("timer:update", handleUpdate);
    socket.on("timer:ended", handleEnded);

    return () => {
      socket.emit("timer:leave", { gameId });
      socket.off("connect", handleConnect);
      socket.off("timer:update", handleUpdate);
      socket.off("timer:ended", handleEnded);
    };
  }, [gameId, setTimeRemaining]);

  const isExpired = timeRemainingSeconds <= 0;

  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return {
    timeRemaining: timeRemainingSeconds,
    formattedTime,
    isExpired,
  };
};

export default useGameTimer;
