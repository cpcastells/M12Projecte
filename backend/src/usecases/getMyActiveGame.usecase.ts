import { gameActionRepository } from "../repositories/gameAction.repository";

/**
 * Use case: obtenir la partida activa de l'usuari.
 *
 * Responsabilitats:
 * - Recuperar la partida associada a l'usuari.
 * - Verificar que la partida està en estat actiu.
 * - Retornar la partida amb informació safe per al client.
 *
 * Notes d'arquitectura:
 * - Aquest use case NO parla amb Prisma.
 * - La verificació d'estat i els includes SAFE estan encapsulats al repository.
 */
export async function getMyActiveGameUseCase(userId: number) {
  try {
    const game = await gameActionRepository.findActiveByUserWithRoom(userId);
    if (!game) {
      return {
        status: 404,
        body: {
          message: "No s'ha trobat cap partida activa per aquest usuari",
        },
      };
    }
    return {
      status: 200,
      body: { game },
    };
  } catch (error) {
    console.error(error);

    return {
      status: 500,
      body: {
        message: "Error intern del servidor",
      },
    };
  }
}
