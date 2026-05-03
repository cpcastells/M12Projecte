import { GAME_CONSTANTS } from "../constants/game.constants";
import { gameActionRepository } from "../repositories/gameAction.repository";
import { defaultGameState, isValidGameState } from "../utils/gameState";
import { askAssistant as callOpenAI } from "../services/openaiClient";

/**
 * Use case: consultar l'assistent ABYSS AI.
 *
 * Regles:
 * - Pregunta no buida i ≤ 300 caràcters.
 * - La partida ha d'estar activa i tenir puzzle.
 * - Si Game.aiEnabled = false, retornem 403.
 * - Comptador global per partida (state.aiHintsUsed) limitat a MAX_AI_HINTS.
 * - Cada consulta penalitza la puntuació en SCORE_HINT_PENALTY.
 * - Si OpenAI falla, retornem 502 i NO modifiquem state ni score.
 * - La columna Game.score es manté sincronitzada amb state.score
 *   (mateix patró que requestHint.usecase).
 */
export const askAssistantUseCase = async (
  userId: number,
  gameId: number,
  question: string,
) => {
  try {
    const trimmed = typeof question === "string" ? question.trim() : "";
    if (!trimmed) {
      return { status: 400, body: { message: "Pregunta buida" } };
    }
    if (trimmed.length > 300) {
      return { status: 400, body: { message: "Pregunta massa llarga" } };
    }

    const game = await gameActionRepository.findActiveWithHints(gameId, userId);

    if (!game || !game.currentRoom) {
      return { status: 404, body: { message: "Partida activa no trobada" } };
    }

    const puzzle = game.currentRoom.puzzle;
    if (!puzzle) {
      return { status: 400, body: { message: "Aquesta sala no té puzzle" } };
    }

    if (game.aiEnabled === false) {
      return {
        status: 403,
        body: { message: "Assistent desactivat per aquesta partida" },
      };
    }

    const currentState = isValidGameState(game.state)
      ? game.state
      : defaultGameState();

    if (currentState.aiHintsUsed >= GAME_CONSTANTS.MAX_AI_HINTS) {
      return {
        status: 400,
        body: { message: "Límit de consultes a l'assistent assolit" },
      };
    }

    let reply: string;
    try {
      reply = await callOpenAI({
        room: {
          name: game.currentRoom.name,
          description: game.currentRoom.description,
        },
        puzzle: {
          statement: puzzle.statement,
          solution: puzzle.solution,
          hints: puzzle.hints,
        },
        question: trimmed,
      });
    } catch (err) {
      console.error("OpenAI error:", err);
      return {
        status: 502,
        body: {
          fallback: true,
          message: "Canal de comunicació inestable",
        },
      };
    }

    const newState = {
      ...currentState,
      aiHintsUsed: currentState.aiHintsUsed + 1,
      score: Math.max(
        GAME_CONSTANTS.MIN_SCORE,
        currentState.score - GAME_CONSTANTS.SCORE_HINT_PENALTY,
      ),
    };

    await gameActionRepository.updateState(gameId, newState, newState.score);

    return {
      status: 200,
      body: {
        reply,
        aiHintsUsed: newState.aiHintsUsed,
        aiHintsRemaining: GAME_CONSTANTS.MAX_AI_HINTS - newState.aiHintsUsed,
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
};
