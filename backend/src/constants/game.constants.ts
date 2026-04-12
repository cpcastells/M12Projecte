/**
 * Constants del joc (regles bàsiques).
 * Centralitza puntuació, penalitzacions i configuració inicial.
 */
export const GAME_CONSTANTS = {
  // Temps
  INITIAL_TIME_SECONDS: 30 * 60, // 30 minuts

  // Pistes
  MAX_HINTS: 3,

  // Puntuació
  SCORE_CORRECT_ANSWER: 200,
  SCORE_WRONG_ANSWER_PENALTY: 50,
  SCORE_HINT_PENALTY: 100,

  // Seguretat/limits
  MIN_SCORE: 0,
} as const;
