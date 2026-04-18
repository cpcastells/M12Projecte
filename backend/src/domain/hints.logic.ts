import { GAME_CONSTANTS } from "../constants/game.constants";
import { GameState } from "../types/game";

/**
 * Indica si l'usuari encara pot sol·licitar una pista
 * en la sala actual.
 *
 * Regla de negoci:
 * - El nombre de pistes utilitzades no pot superar MAX_HINTS.
 */
export function canRequestHint(state: GameState): boolean {
  return state.hintsUsed < GAME_CONSTANTS.MAX_HINTS;
}

/**
 * Aplica la penalització associada a la sol·licitud d'una pista.
 *
 * Regles de negoci:
 * - Incrementa el nombre de pistes utilitzades.
 * - Redueix la puntuació segons SCORE_HINT_PENALTY.
 * - La puntuació no pot baixar de MIN_SCORE.
 */
export function applyHintPenalty(state: GameState): GameState {
  return {
    ...state,
    hintsUsed: state.hintsUsed + 1,
    score: Math.max(
      GAME_CONSTANTS.MIN_SCORE,
      state.score - GAME_CONSTANTS.SCORE_HINT_PENALTY,
    ),
  };
}

/**
 * Retorna el nombre de pistes disponibles que queden
 * a la sala actual.
 */
export function hintsRemaining(state: GameState): number {
  return GAME_CONSTANTS.MAX_HINTS - state.hintsUsed;
}
