import { GAME_CONSTANTS } from "../constants/game.constants";
import { gameActionRepository } from "../repositories/gameAction.repository";
import { defaultGameState, isValidGameState } from "../utils/gameState";

/**
 * Use case: gestionar la sol·licitud d'una pista.
 *
 * Responsabilitats:
 * - Verificar que la partida i el puzzle són vàlids.
 * - Aplicar les regles de negoci de les pistes:
 *   - límit de 3 pistes per sala
 *   - penalització de puntuació (SCORE_HINT_PENALTY)
 * - Retornar la pista corresponent segons l'ordre definit (ordenat per Hint.order).
 */
export async function requestHintUseCase(userId: number, gameId: number) {
  try {
    const game = await gameActionRepository.findActiveWithHints(gameId, userId);

    if (!game || !game.currentRoom) {
      return { status: 404, body: { message: "Partida activa no trobada" } };
    }

    const puzzle = game.currentRoom.puzzle;
    if (!puzzle) {
      return { status: 400, body: { message: "Aquesta sala no té puzzle" } };
    }

    const currentState = isValidGameState(game.state)
      ? game.state
      : defaultGameState();

    if (currentState.hintsUsed >= GAME_CONSTANTS.MAX_HINTS) {
      return {
        status: 400,
        body: { message: "No queden pistes per aquesta sala" },
      };
    }

    const hint = puzzle.hints[currentState.hintsUsed];
    if (!hint) {
      return {
        status: 400,
        body: { message: "No hi ha més pistes disponibles" },
      };
    }

    const newState = {
      ...currentState,
      hintsUsed: currentState.hintsUsed + 1,
      score: Math.max(
        GAME_CONSTANTS.MIN_SCORE,
        currentState.score - GAME_CONSTANTS.SCORE_HINT_PENALTY,
      ),
    };

    await gameActionRepository.updateState(gameId, newState, newState.score);

    return {
      status: 200,
      body: {
        hint: hint.text,
        hintsUsed: newState.hintsUsed,
        hintsRemaining: GAME_CONSTANTS.MAX_HINTS - newState.hintsUsed,
        state: newState,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      status: 500,
      body: { message: "Error intern del servidor" },
    };
  }
}
