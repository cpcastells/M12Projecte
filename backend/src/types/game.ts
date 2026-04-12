/**
 * Estat intern del joc emmagatzemat al camp `state` (JSON) de la BD.
 * Ha de coincidir amb el tipus definit al frontend (types/game.ts).
 */
export type GameState = {
  hintsUsed: number;
  maxHints: number;
  timeRemainingSeconds: number;
  score: number;
  solvedPuzzleIds: number[];
  collectedObjectIds: number[];
  usedObjectIds: number[];
};
