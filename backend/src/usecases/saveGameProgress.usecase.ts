import { gameActionRepository } from "../repositories/gameAction.repository";
import { isValidGameState } from "../utils/gameState";

/**
 * Use case: persistir el progrés temporal d'una partida.
 *
 * Responsabilitats:
 * - Validar que la partida pertany a l'usuari.
 * - Validar que l'estat compleix el contracte GameState.
 * - Persistir l'estat actual de la partida.
 *
 * Nota:
 * Aquest use case no aplica lògica de joc ni regles de progressió.
 * La lògica de negoci principal es gestiona mitjançant
 * use cases d'acció com submitPuzzleAnswer o requestHint.
 *
 * Notes d'arquitectura:
 * - Aquest use case NO parla amb Prisma.
 * - Les decisions de persistència i includes SAFE estan encapsulades al repository.
 */
export async function saveGameProgressUseCase(
  userId: number,
  gameId: number,
  state: unknown,
) {
  try {
    if (!gameId) {
      return { status: 400, body: { message: "Falta gameId" } };
    }
    // Validem contracte GameState
    if (state === undefined || !isValidGameState(state)) {
      return {
        status: 400,
        body: { message: "state invàlid (format GameState requerit)" },
      };
    }

    const updatedGame = await gameActionRepository.saveGameProgress(
      userId,
      gameId,
      state,
    );

    if (!updatedGame) {
      return {
        status: 404,
        body: { message: "Partida no trobada" },
      };
    }

    return {
      status: 200,
      body: {
        message: "Progrés guardat correctament",
        game: updatedGame,
      },
    };
  } catch (error) {
    console.error("Error guardant el progrés:", error);
    return {
      status: 500,
      body: { message: "Error intern del servidor" },
    };
  }
}
