import type { ObjectInteraction } from "../types/game";
import { gameActionRepository } from "../repositories/gameAction.repository";
import {
  getStateOrDefault,
  registerObjectInteraction,
} from "../utils/gameState";

const ALLOWED_INTERACTIONS: Array<keyof ObjectInteraction> = [
  "consulted",
  "activated",
  "used",
];

/**
 * Use case: registrar una interacció d'un objecte dins de la partida.
 *
 * Responsabilitats:
 * - Verificar que la partida activa existeix i pertany a l'usuari.
 * - Validar el tipus d'interacció.
 * - Actualitzar el Game.state amb la nova interacció.
 *
 * Nota:
 * - Aquesta interacció pertany a la partida, no a l'objecte global.
 */
export async function registerObjectInteractionUseCase(
  userId: number,
  gameId: number,
  objectId: number,
  interaction: unknown,
) {
  try {
    if (!gameId || Number.isNaN(gameId)) {
      return {
        status: 400,
        body: { message: "gameId invàlid" },
      };
    }

    if (!objectId || Number.isNaN(objectId)) {
      return {
        status: 400,
        body: { message: "objectId invàlid" },
      };
    }

    if (
      typeof interaction !== "string" ||
      !ALLOWED_INTERACTIONS.includes(interaction as keyof ObjectInteraction)
    ) {
      return {
        status: 400,
        body: {
          message:
            "interaction invàlida. Valors permesos: consulted, activated, used",
        },
      };
    }

    const game = await gameActionRepository.findActiveByIdAndUser(
      gameId,
      userId,
    );

    if (!game) {
      return {
        status: 404,
        body: { message: "Partida activa no trobada" },
      };
    }

    const currentState = getStateOrDefault(game.state);

    const newState = registerObjectInteraction(
      currentState,
      objectId,
      interaction as keyof ObjectInteraction,
    );

    const updatedGame = await gameActionRepository.updateStateWithRoom(
      gameId,
      newState,
    );

    return {
      status: 200,
      body: {
        message: "Interacció registrada correctament",
        game: updatedGame,
        state: updatedGame.state,
      },
    };
  } catch (error) {
    console.error("Error registrant interacció d'objecte:", error);

    return {
      status: 500,
      body: { message: "Error intern del servidor" },
    };
  }
}
