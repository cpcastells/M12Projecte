/**
 * Estat intern del joc emmagatzemat al camp `state` (JSON) de la BD.
 *
 * Aquest tipus representa l'estat de negoci de la partida i és manipulat
 * exclusivament pel domain i els use cases.
 *
 * Ha de coincidir amb el tipus definit al frontend (types/game.ts).
 */
export type GameState = {
  hintsUsed: number;
  maxHints: number; // Límit de pistes per sala. Actualment derivat de GAME_CONSTANTS.
  timeRemainingSeconds: number;
  score: number;
  solvedPuzzleIds: number[];
  collectedObjectIds: number[];
  usedObjectIds: number[];
  // Sales que el jugador ja ha desbloquejat
  unlockedRoomIds: number[];
};
