import { GameStatus, type Prisma } from "@prisma/client";
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
   * Retorna la partida de l'usuari (1 user = 1 game) amb la sala actual (SAFE).
   * Utilitzada per startGame i getMyLastGame.
   */
  findByUserWithRoom(userId: number) {
    return prisma.game.findUnique({
      where: { userId },
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

  /**
   * Retorna l'última partida (ordenada per createdAt desc).
   * Amb el teu schema (1 user = 1 game) això normalment serà la mateixa.
   * Però ho deixem per si algun dia canvieu el model.
   */
  findLastByUserWithRoom(userId: number) {
    return prisma.game.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { currentRoom: { include: roomIncludeForResponse } },
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
  ) {
    return prisma.game.update({
      where: { id: gameId },
      data: { currentRoomId: nextRoomId, state },
      include: { currentRoom: { include: roomIncludeForResponse } },
    });
  },

  /**
   * Marca la partida com a completada.
   */
  completeGame(gameId: number, state: Prisma.InputJsonValue) {
    return prisma.game.update({
      where: { id: gameId },
      data: { status: GameStatus.completed, currentRoomId: null, state },
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
  updateState(gameId: number, state: Prisma.InputJsonValue) {
    return prisma.game.update({
      where: { id: gameId },
      data: { state: state as unknown as Prisma.InputJsonValue },
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
};
