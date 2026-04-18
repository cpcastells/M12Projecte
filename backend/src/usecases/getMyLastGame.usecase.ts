import { gameActionRepository } from "../repositories/gameAction.repository";

/**
 * Use case: obtenir l'última partida de l'usuari.
 *
 * Responsabilitats:
 * - Recuperar la partida més recent associada a l'usuari
 *   independentment del seu estat (activa o completada).
 *
 * Notes d'arquitectura:
 * - Aquest use case NO parla amb Prisma.
 * - Els criteris d'ordenació i els includes SAFE estan encapsulats al repositori
 */
export async function getMyLastGameUseCase(userId: number) {
  try {
    const game = await gameActionRepository.findLastByUserWithRoom(userId);

    if (!game) {
      return {
        status: 404,
        body: {
          message: "No s'ha trobat cap partida per aquest usuari",
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
