"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getActiveGame,
  getLastGame,
  startNewGame,
  updateGameStatus,
} from "@/services/game/gameService";
import type { Game } from "@/types/game";

type GameContextType = {
  activeGame: Game | null;
  lastGame: Game | null;
  isLoadingGame: boolean;
  refreshGame: () => Promise<void>;
  startGame: () => Promise<Game>;
  abandonGame: () => Promise<void>;
};

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [lastGame, setLastGame] = useState<Game | null>(null);
  const [isLoadingGame, setIsLoadingGame] = useState(false);

  const refreshGame = useCallback(async () => {
    if (!isAuthenticated) {
      setActiveGame(null);
      setLastGame(null);
      return;
    }

    setIsLoadingGame(true);
    try {
      const [activeRes, lastRes] = await Promise.allSettled([
        getActiveGame(),
        getLastGame(),
      ]);

      setActiveGame(
        activeRes.status === "fulfilled" ? activeRes.value.game : null,
      );
      setLastGame(lastRes.status === "fulfilled" ? lastRes.value.game : null);
    } finally {
      setIsLoadingGame(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshGame();
  }, [refreshGame]);

  const startGame = async (): Promise<Game> => {
    const { game } = await startNewGame();
    setActiveGame(game);
    setLastGame(game);
    return game;
  };

  const abandonGame = async () => {
    if (!activeGame) return;
    await updateGameStatus(activeGame.id, "abandoned");
    setActiveGame(null);
  };

  return (
    <GameContext.Provider
      value={{
        activeGame,
        lastGame,
        isLoadingGame,
        refreshGame,
        startGame,
        abandonGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame s'ha d'utilitzar dins d'un GameProvider");
  return ctx;
};
