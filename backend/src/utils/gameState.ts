import type { GameState } from "../types/game";

export function defaultGameState(): GameState {
  return {
    hintsUsed: 0,
    maxHints: 3,
    timeRemainingSeconds: 1800,
    score: 0,
    solvedPuzzleIds: [],
    collectedObjectIds: [],
    usedObjectIds: [],
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
    Array.isArray(s.usedObjectIds)
  );
}
