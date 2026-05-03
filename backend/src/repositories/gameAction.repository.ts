import { GameEndReason, GameStatus, type Prisma } from "@prisma/client";
import {
  roomIncludeForResponse,
  roomIncludeForValidation,
} from "./room.includes";
import { prisma } from "../db/prisma";

/**
 * Repository d'accions del joc (Game Actions).
 *
 * Responsabilitat:
 * - Donar suport als casos d'ús d'acció del joc (start, me/*, answer, hint, progressió).
 *
 * Aquest repository:
 * - Conté queries específiques i combinades.
 * - Pot incloure dades sensibles (ex: puzzle.solution) quan és necessari (BACKEND ONLY).
 * - NO conté lògica de negoci ni decisions de fluxe (això és domain/use cases).
 *
 * Les regles del joc s'implementen al domain i l'orquestració del flux als use cases.
 */
export const gameActionRepository = {
  // ****** QUERIES "by user" (start / me/*) *****************

  /**
   * Retorna l'última partida de l'usuari (qualsevol estat) amb la sala actual.
   * Després de relaxar la restricció 1:1, `startGame` només hauria de mirar
   * si hi ha una partida ACTIVA (veure findActiveByUserWithRoom). Aquest
   * helper es manté per a consumidors que realment volen l'última partida
   * històrica.
   */
  findLatestByUserWithRoom(userId: number) {
    return prisma.game.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { currentRoom: { include: roomIncludeForResponse } },
    });
  },

  /**
   * Retorna la partida ACTIVA de l'usuari amb la sala actual (SAFE).
   * Utilitzada per getMyActiveGame.
   */
  findActiveByUserWithRoom(userId: number) {
    return prisma.game.findFirst({
      where: { userId, status: GameStatus.active },
      include: { currentRoom: { include: roomIncludeForResponse } },
    });
  },

  /**
   * Retorna totes les partides d'un usuari amb els camps necessaris per
   * calcular estadístiques agregades, ordenades per data descendent.
   * Utilitzada per getUserStats.
   */
  findAllByUserForStats(userId: number) {
    return prisma.game.findMany({
      where: { userId },
      select: {
        id: true,
        status: true,
        endReason: true,
        state: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Retorna una partida activa concreta per id + userId.
   * Utilitzada per registrar interaccions o altres accions puntuals.
   */
  findActiveByIdAndUser(gameId: number, userId: number) {
    return prisma.game.findFirst({
      where: {
        id: gameId,
        userId,
        status: GameStatus.active,
      },
    });
  },

  // ****** START/CREATE *****************

  /**
   * Crea una partida nova en estat actiu amb sala inicial i estat inicial.
   */
  createNewGame(
    userId: number,
    initialRoomId: number,
    state: Prisma.InputJsonValue,
  ) {
    return prisma.game.create({
      data: {
        userId,
        status: GameStatus.active,
        currentRoomId: initialRoomId,
        state,
      },
      include: { currentRoom: { include: roomIncludeForResponse } },
    });
  },

  // ****** Answer / Progressió (requereix solution - BACKEND ONLY) *****************

  /**
   * Recupera la partida activa amb el puzzle actual i la seva solució.
   *
   * Utilitzada per submitPuzzleAnswer.
   */
  findActiveGameWithPuzzle(gameId: number, userId: number) {
    return prisma.game.findFirst({
      where: { id: gameId, userId, status: GameStatus.active },
      include: {
        currentRoom: {
          include: roomIncludeForValidation, // inclou solution (backend-only)
        },
      },
    });
  },

  /**
   * Recupera la següent sala segons l'ordre.
   *
   * El càlcul de l'ordre es fa al use case.
   */
  findNextRoomByOrder(order: number) {
    return prisma.room.findUnique({ where: { order } });
  },

  /**
   * Avança la partida a la següent sala i retorna la nova sala (SAFE).
   */
  advanceRoom(
    gameId: number,
    nextRoomId: number,
    state: Prisma.InputJsonValue,
    score: number,
  ) {
    return prisma.game.update({
      where: { id: gameId },
      data: { currentRoomId: nextRoomId, state, score },
      include: { currentRoom: { include: roomIncludeForResponse } },
    });
  },

  /**
   * Marca la partida com a completada.
   */
  completeGame(gameId: number, state: Prisma.InputJsonValue, score: number) {
    return prisma.game.update({
      where: { id: gameId },
      data: {
        status: GameStatus.completed,
        endReason: GameEndReason.success,
        currentRoomId: null,
        state,
        score,
      },
    });
  },

  // ****** Hint (carrega hints ordenades) *****************

  /**
   * Recupera la partida activa amb el puzzle actual i les pistes (ordenades).
   *
   * Utilitzada exclusivament pel cas d'ús requestHint.
   */
  findActiveWithHints(gameId: number, userId: number) {
    return prisma.game.findFirst({
      where: {
        id: gameId,
        userId,
        status: GameStatus.active,
      },
      include: {
        currentRoom: {
          include: {
            puzzle: {
              include: {
                hints: { orderBy: { order: "asc" } },
              },
            },
          },
        },
      },
    });
  },

  // ****** State (canvis) *****************

  /**
   * Actualitza l'estat del joc.
   */
  updateState(gameId: number, state: Prisma.InputJsonValue, score?: number) {
    return prisma.game.update({
      where: { id: gameId },
      data: {
        state: state as unknown as Prisma.InputJsonValue,
        ...(score !== undefined ? { score } : {}),
      },
    });
  },

  /**
   * Actualitza l'estat del joc i retorna la partida amb la sala actual (SAFE).
   * Utilitzada per registrar interaccions i retornar la partida actualitzada.
   */
  updateStateWithRoom(gameId: number, state: Prisma.InputJsonValue) {
    return prisma.game.update({
      where: { id: gameId },
      data: { state },
      include: {
        currentRoom: { include: roomIncludeForResponse },
      },
    });
  },

  /**
   * Actualitza només el status de la partida i retorna la partida amb la sala (SAFE en resposta).
   * IMPORTANT: No usar per finalitzar partides.
   * Amb el nou model (status + endReason), les finalitzacions s'han de fer amb
   * endActiveGame(...) / abandonActiveGame(...) per mantenir consistència i estadístiques.
   */
  updateStatus(gameId: number, status: GameStatus) {
    return prisma.game.update({
      where: { id: gameId },
      data: { status },
      include: {
        currentRoom: { include: roomIncludeForResponse },
      },
    });
  },

  /**
   * Guarda l'estat del joc validant que la partida pertany a l'usuari.
   * Retorna la partida amb informació SAFE o null si no existeix o no pertany.
   */
  async saveGameProgress(
    userId: number,
    gameId: number,
    state: Prisma.InputJsonValue,
  ) {
    const game = await prisma.game.findFirst({
      where: { id: gameId, userId },
    });

    if (!game) return null;

    return prisma.game.update({
      where: {
        id: gameId,
        userId,
      },
      data: {
        state,
      },
      include: {
        currentRoom: { include: roomIncludeForResponse },
      },
    });
  },

  /**
   * Finalitza una partida ACTIVA de l'usuari de forma atòmica:
   * - success => status=completed
   * - qualsevol altre => status=ended
   *
   * Nota: No permet finalitzar partides que no siguin actives.
   */
  async endActiveGame(
    gameId: number,
    userId: number,
    endReason: GameEndReason,
    state?: Prisma.InputJsonValue,
  ) {
    const nextStatus =
      endReason === GameEndReason.success
        ? GameStatus.completed
        : GameStatus.ended;

    // Fem updateMany per poder filtrar per (id + userId + status=active)
    const { count } = await prisma.game.updateMany({
      where: { id: gameId, userId, status: GameStatus.active },
      data: {
        status: nextStatus,
        endReason,
        currentRoomId: null,
        ...(state ? { state } : {}),
      },
    });

    if (count === 0) return null;

    // Retornem la partida actualitzada amb dades SAFE
    return prisma.game.findUnique({
      where: { id: gameId },
      include: { currentRoom: { include: roomIncludeForResponse } },
    });
  },

  /**
   * Abandonar partida (equivalent de active -> abandoned).
   */
  abandonActiveGame(gameId: number, userId: number) {
    return this.endActiveGame(gameId, userId, GameEndReason.abandoned);
  },
};
