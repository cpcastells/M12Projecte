import type { GameState } from "../types/game";
import { GAME_CONSTANTS } from "../constants/game.constants";

export function defaultGameState(): GameState {
  return {
    hintsUsed: 0,
    maxHints: GAME_CONSTANTS.MAX_HINTS,
    timeRemainingSeconds: GAME_CONSTANTS.INITIAL_TIME_SECONDS,
    score: 0,
    solvedPuzzleIds: [],
    collectedObjectIds: [],
    usedObjectIds: [],

    // La sala inicial (room1) queda desbloquejada des del principi
    unlockedRoomIds: [1],
  };
}

export function isValidGameState(x: unknown): x is GameState {
  const s = x as any;
  return (
    s &&
    typeof s === "object" &&
    typeof s.hintsUsed === "number" &&
    typeof s.maxHints === "number" &&
    typeof s.timeRemainingSeconds === "number" &&
    typeof s.score === "number" &&
    Array.isArray(s.solvedPuzzleIds) &&
    Array.isArray(s.collectedObjectIds) &&
    Array.isArray(s.usedObjectIds) &&
    //array sala desloqueada
    Array.isArray(s.unlockedRoomIds)
  );
}
