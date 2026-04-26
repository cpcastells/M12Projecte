import { GAME_CONSTANTS } from "../constants/game.constants";
import { GameState } from "../types/game";

/**
 * Normalitza una cadena de text per a comparacions.
 *
 * - Elimina espais en blanc inicials i finals.
 * - Converteix el text a minúscules.
 *
 * S'utilitza per fer comparacions de respostes
 * independents de format.
 */
export function normalize(s: string): string {
  return s.trim().toLowerCase();
}

/**
 * Determina si una resposta és correcta comparant-la
 * amb la solució del puzzle després de normalitzar-les.
 *
 * Aquesta funció encapsula la regla de negoci
 * de validació de respostes.
 */
export function isCorrectAnswer(answer: string, solution: string): boolean {
  return normalize(answer) === normalize(solution);
}

/**
 * Aplica els efectes d'una resposta incorrecta sobre l'estat del joc.
 *
 * Regles de negoci:
 * - Redueix la puntuació segons SCORE_WRONG_ANSWER_PENALTY.
 * - La puntuació mai pot baixar de MIN_SCORE.
 * - Afegeix un intent a la resolució de l'enigme
 */
export function applyWrongAnswer(state: GameState): GameState {
  return {
    ...state,
    attemptsUsed: state.attemptsUsed + 1,
    score: Math.max(
      GAME_CONSTANTS.MIN_SCORE,
      state.score - GAME_CONSTANTS.SCORE_WRONG_ANSWER_PENALTY,
    ),
  };
}

/**
 * Aplica els efectes d'una resposta correcta sobre l'estat del joc.
 *
 * Regles de negoci:
 * - Marca el puzzle com resolt.
 * - Incrementa la puntuació segons SCORE_CORRECT_ANSWER.
 *
 * Nota:
 * Aquesta funció NO gestiona el canvi de sala ni el desbloqueig
 * de noves sales. Aquest flux es decideix a nivell de use case.
 */
export function applyCorrectAnswer(
  state: GameState,
  puzzleId: number,
): GameState {
  const solved = new Set(state.solvedPuzzleIds.map(Number));
  solved.add(puzzleId);

  const unlocked = Array.isArray(state.unlockedRoomIds)
    ? state.unlockedRoomIds
    : [1];

  return {
    ...state,
    solvedPuzzleIds: Array.from(solved),
    score: state.score + GAME_CONSTANTS.SCORE_CORRECT_ANSWER,
    unlockedRoomIds: unlocked,
  };
}

/**
 * Reinicia el comptador de pistes utilitzades.
 *
 * S'utilitza en canviar de sala, ja que el límit
 * de pistes és per sala i no global.
 */
export function resetHintsForNextRoom(state: GameState): GameState {
  return { ...state, hintsUsed: 0 };
}

/**
 * Reinicia el comptador d'intents utilitzats per resoldre l'enigma.
 *
 * S'utilitza en canviar de sala, ja que el límit
 * d'intents és per enigma (sala) i no global.
 */
export function resetAttemptsForNextRoom(state: GameState): GameState {
  return { ...state, attemptsUsed: 0 };
}

/**
 *
 * * Indica si s'han superat els intents permesos.
 *
 * Regla de negoci:
 * - El nombre d'intents utilitzats no pot superar MAX_ATTEMPTS.
 *
 * */
export function hasExceededAttempts(state: GameState): boolean {
  return state.attemptsUsed >= GAME_CONSTANTS.MAX_ATTEMPTS;
}
