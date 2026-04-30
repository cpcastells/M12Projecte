import type { GameState, ObjectInteraction } from "../types/game";
import { GAME_CONSTANTS } from "../constants/game.constants";

/**
 * Construeix l'estat inicial d'una partida nova.
 *
 * Aquest estat representa el punt de partida del joc i compleix
 * el contracte definit per GameState.
 *
 * Nota:
 * - Alguns valors (com maxHints o temps inicial) deriven de GAME_CONSTANTS.
 * - Lògica de negoci (penalitzacions, validacions, progressió) NO s'aplica aquí,
 *   sinó al domain i als use cases.
 */
export function defaultGameState(): GameState {
  return {
    hintsUsed: 0,
    aiHintsUsed: 0,
    attemptsUsed: 0,
    timeRemainingSeconds: GAME_CONSTANTS.INITIAL_TIME_SECONDS,
    score: 0,
    solvedPuzzleIds: [],
    collectedObjectIds: [],
    usedObjectIds: [],
    // La sala inicial (room1) queda desbloquejada des del principi
    unlockedRoomIds: [1],
    objectInteractions: {},
  };
}

/**
 * Comprova si un valor desconegut compleix el contracte mínim de GameState.
 *
 * Aquesta funció s'utilitza principalment per:
 * - Validar l'estat rebut des del client (ex: /save).
 * - Evitar errors en partides antigues o dades corruptes.
 *
 * Nota:
 * - Es valida només l'estructura (shape), no la coherència semàntica.
 */
export function isValidGameState(x: unknown): x is GameState {
  const s = x as any;
  return (
    s &&
    typeof s === "object" &&
    typeof s.hintsUsed === "number" &&
    typeof s.timeRemainingSeconds === "number" &&
    typeof s.score === "number" &&
    Array.isArray(s.solvedPuzzleIds) &&
    Array.isArray(s.collectedObjectIds) &&
    Array.isArray(s.usedObjectIds) &&
    Array.isArray(s.unlockedRoomIds)
  );
}

/**
 * Retorna un GameState vàlid a partir d'un valor desconegut.
 *
 * - Si l'estat és vàlid, es retorna tal qual.
 * - Si no ho és, es retorna l'estat inicial per defecte.
 *
 * Aquesta funció garanteix que els use cases sempre treballin
 * amb un GameState coherent.
 */
export function getStateOrDefault(x: unknown): GameState {
  return isValidGameState(x)
    ? {
        ...(x as GameState),
        attemptsUsed:
          typeof (x as any).attemptsUsed === "number"
            ? (x as any).attemptsUsed
            : 0,
      }
    : defaultGameState();
}
/**
 * Registra una interacció sobre un objecte dins de l'estat de partida.
 *
 * Exemple:
 * - consulted -> l'usuari ha inspeccionat l'objecte
 * - activated -> l'usuari ha activat l'objecte
 * - used -> l'usuari ha utilitzat l'objecte
 *
 * Aquesta funció no parla amb BD; només transforma l'estat.
 */
export function registerObjectInteraction(
  state: GameState,
  objectId: number,
  interaction: keyof ObjectInteraction,
): GameState {
  return {
    ...state,
    objectInteractions: {
      ...state.objectInteractions,
      [objectId]: {
        ...state.objectInteractions[objectId],
        [interaction]: true,
      },
    },
  };
}
