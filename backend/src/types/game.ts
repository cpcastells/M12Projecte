/**
 * Estat intern del joc emmagatzemat al camp `state` (JSON) de la BD.
 *
 * Aquest tipus representa l'estat de negoci de la partida i és manipulat
 * exclusivament pel domain i els use cases.
 *
 * Ha de coincidir amb el tipus definit al frontend (types/game.ts).
 */

export type ObjectInteraction = {
  consulted?: boolean;
  activated?: boolean;
  used?: boolean;
};

export type GameState = {
  hintsUsed: number;
  timeRemainingSeconds: number;
  score: number;
  solvedPuzzleIds: number[];
  collectedObjectIds: number[];
  usedObjectIds: number[];
  // Sales que el jugador ja ha desbloquejat
  unlockedRoomIds: number[];

  // Registre d'interaccions per objecte dins de la partida
  // Ex: { 3: { consulted: true }, 5: { activated: true, used: true } }
  objectInteractions: Record<number, ObjectInteraction>;
};
