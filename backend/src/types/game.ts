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
  aiHintsUsed: number; // pistesque ha demanat el jugador a la IA
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
  // Estat específic de la IA (assistent ABYSS AI)
  // ai: GameAIState;
};

/**
 * Estat relacionat amb l'assistent d'IA (ABYSS AI) dins del GameState.
 *
 * NOTA:
 * - Aquest estat NO s'utilitza actualment.
 * - Es deixa documentat per a futures decisions
 *
 * Aquest estat forma part del camp `state` (JSON) de la partida i
 * emmagatzema informació dinàmica específica de la interacció amb la IA.
 *
 * No reflecteix configuració global ni contingut estàtic del joc,
 * sinó accions concretes del jugador durant la partida.
 */
/*export interface GameAIState {
  enabled: boolean;
  hints: {
    used: number;
    limit?: number;
    history: {
      roomId: number;
      puzzleId?: number;
      prompt: string;
      response: string;
      createdAt: string;
    }[];
  };
}*/
