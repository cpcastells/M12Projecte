/**
 * Constants de joc compartides (mateixos valors que backend/src/constants/game.constants.ts).
 * Si canvien aquí, cal canviar-les també al backend — i viceversa.
 */
export const GAME_CONSTANTS = {
  INITIAL_TIME_SECONDS: 30 * 60,
  MAX_HINTS: 3,
  SCORE_CORRECT_ANSWER: 200,
  SCORE_WRONG_ANSWER_PENALTY: 50,
  SCORE_HINT_PENALTY: 100,
  MIN_SCORE: 0,
} as const;
