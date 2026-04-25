import { roomRepository } from "../repositories/room.repository";
import { gameActionRepository } from "../repositories/gameAction.repository";
import { defaultGameState } from "../utils/gameState";

/**
 * Use case: iniciar o recuperar la partida ACTIVA d'un usuari.
 *
 * Responsabilitats:
 * - Si hi ha una partida amb status=active, retornar-la.
 * - Si no n'hi ha (totes les anteriors són completed/ended), crear-ne una
 *   nova amb la sala inicial.
 *
 * Invariant: un usuari pot tenir N partides històriques però com a màxim
 * una amb status=active. Aquesta invariant viu al use case (no a la BD)
 * per mantenir la migració simple; qualsevol altra escriptura que vulgui
 * crear partides ha de respectar-la.
 */
export async function startGameUseCase(userId: number) {
  try {
    const existingActive =
      await gameActionRepository.findActiveByUserWithRoom(userId);

    if (existingActive) {
      return {
        status: 200,
        body: {
          message: "Ja tens una partida activa. Pots continuar-la.",
          game: existingActive,
        },
      };
    }

    const initialRoom = await roomRepository.findInitialRoom();

    if (!initialRoom) {
      return {
        status: 404,
        body: { message: "No s'ha trobat cap sala inicial" },
      };
    }

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
