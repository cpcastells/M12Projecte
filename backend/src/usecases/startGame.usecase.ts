import { roomRepository } from "../repositories/room.repository";
import { gameActionRepository } from "../repositories/gameAction.repository";
import { defaultGameState } from "../utils/gameState";

/**
 * Use case: iniciar o recuperar la partida d'un usuari.
 *
 * Responsabilitats:
 * - Comprovar si l'usuari ja té una partida existent.
 * - Crear una nova partida si no existeix, assignant la sala inicial.
 * - Retornar la partida amb informació safe per al frontend.
 *
 * Aquest use case encapsula tota la lògica de negoci relacionada
 * amb la creació i inicialització de la partida.
 * Notes d'arquitectura:
 * - Aquest use case NO parla amb Prisma directament.
 * - Les queries i includes (safe/validation) estan encapsulats als repositories.
 */
export async function startGameUseCase(userId: number) {
  try {
    // 1 user = 1 game, si existeix la retornem
    const existing = await gameActionRepository.findByUserWithRoom(userId);

    if (existing) {
      return {
        status: 200,
        body: {
          message: "Ja tens una partida. Pots continuar-la o abandonar-la.",
          game: existing,
        },
      };
    }

    // Busquem la sala inicial
    const initialRoom = await roomRepository.findInitialRoom();

    if (!initialRoom) {
      return {
        status: 404,
        body: { message: "No s'ha trobat cap sala inicial" },
      };
    }

    //Crearem la partida nova
    const game = await gameActionRepository.createNewGame(
      userId,
      initialRoom.id,
      defaultGameState(),
    );

    return {
      status: 201,
      body: {
        message: "Partida iniciada correctament",
        game,
      },
    };
  } catch (error) {
    console.error("Error iniciant la partida:", error);

    return {
      status: 500,
      body: {
        message: "Error intern del servidor",
      },
    };
  }
}
