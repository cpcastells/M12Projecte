"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { saveGame } from "@/services/game/gameService";

type GameContextValue = {
  /** Segons restants (decrementat client-side cada segon). */
  timeRemainingSeconds: number;
  /** Decrementa o força el temps. L'única actualització client-side permesa. */
  setTimeRemaining: (next: number) => void;
  /** Persisteix el timer al backend. Els altres camps del GameState es mantenen al backend. */
  saveTimer: () => Promise<void>;
  isSaving: boolean;
  lastSavedAt: Date | null;
  /** Present si l'últim intent de save ha fallat; null si l'últim ha anat bé. */
  saveError: string | null;
  gameId: number;
};

const GameContext = createContext<GameContextValue | null>(null);

type GameProviderProps = {
  children: React.ReactNode;
  gameId: number;
  initialTimeRemainingSeconds: number;
};

/**
 * Manté només el timer client-side. Els camps de negoci (hintsUsed, score,
 * solvedPuzzleIds, ...) són canònics al backend i s'obtenen via useActiveGame
 * + cache de React Query.
 *
 * Aquest disseny evita el bug de sincronització anterior, en què un save
 * client-driven sobreescrivia camps que el backend acabava d'actualitzar.
 * Ara el save només pot tocar el timer (restringit també al backend).
 */
const GameProvider = ({
  children,
  gameId,
  initialTimeRemainingSeconds,
}: GameProviderProps) => {
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(
    initialTimeRemainingSeconds,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const latestTimeRef = useRef(timeRemainingSeconds);

  useEffect(() => {
    latestTimeRef.current = timeRemainingSeconds;
  }, [timeRemainingSeconds]);

  const setTimeRemaining = useCallback((next: number) => {
    setTimeRemainingSeconds(Math.max(0, Math.floor(next)));
  }, []);

  const saveTimer = useCallback(async () => {
    setIsSaving(true);
    try {
      await saveGame(gameId, { timeRemainingSeconds: latestTimeRef.current });
      setLastSavedAt(new Date());
      setSaveError(null);
    } catch (err) {
      console.error("Error guardant el timer:", err);
      const message =
        err instanceof Error ? err.message : "No s'ha pogut guardar el progrés";
      setSaveError(message);
    } finally {
      setIsSaving(false);
    }
  }, [gameId]);

  // Auto-save periòdic del timer. 60s és prou per recuperar pràcticament
  // tot el temps en cas de refresh/crash, sense martellejar el backend.
  useEffect(() => {
    const interval = setInterval(saveTimer, 60_000);
    return () => clearInterval(interval);
  }, [saveTimer]);

  return (
    <GameContext.Provider
      value={{
        timeRemainingSeconds,
        setTimeRemaining,
        saveTimer,
        isSaving,
        lastSavedAt,
        saveError,
        gameId,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

const useGameContext = () => {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGameContext ha d'estar dins d'un GameProvider");
  }
  return ctx;
};

export { GameProvider, useGameContext };
