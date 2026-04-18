import { prisma } from "../db/prisma";
import { roomIncludeForResponse } from "./room.includes";

/**
 * Repository per a Room.
 *
 * Responsabilitat:
 * - Accés a dades relacionades amb les sales del joc.
 *
 * Aquest repository:
 * - NO conté lògica de progressió ni regles de negoci.
 * - NO decideix quina sala toca a continuació.
 *
 * La decisió del fluxe del joc es gestiona exclusivament als use cases.
 */
export const roomRepository = {
  /**
   * Retorna la sala inicial del joc.
   *
   * Utilitzada en iniciar una nova partida.
   */
  findInitialRoom() {
    return prisma.room.findFirst({
      where: { isInitial: true },
      include: roomIncludeForResponse,
    });
  },

  /**
   * Retorna la següent sala segons l'ordre.
   *
   * La lògica que decideix quin ordre cal consultar
   * pertany al use case, no al repository.
   */
  findNextRoomByOrder(order: number) {
    return prisma.room.findUnique({
      where: { order },
    });
  },
};
