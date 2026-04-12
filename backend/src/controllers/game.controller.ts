import type { Request, Response } from "express";
import type { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";
import type { GameState } from "../types/game";
import { defaultGameState, isValidGameState } from "../utils/gameState";
import { GameStatus } from "@prisma/client";
import { GAME_CONSTANTS } from "../constants/game.constants";

/**
 * Inicia (o recupera) la partida de l'usuari autenticat.
 *
 * Model actual:
 * - 1 usuari = 1 partida (userId @unique)
 * - La sala inicial es determina amb Room.isInitial = true
 * - L'estat de joc es guarda a Game.state amb el contracte GameState
 */
export async function startGame(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuari no autenticat" });
    }

    const userId = Number(req.user.id);

    // 1 user = 1 game (userId @unique)-> si existeix retornem la mateixa partida
    const existing = await prisma.game.findUnique({ where: { userId } });
    if (existing) {
      const game = await prisma.game.findUnique({
        where: { userId },
        include: { currentRoom: { include: { objects: true, puzzle: true } } },
      });

      return res.status(200).json({
        message: "Ja tens una partida. Pots continuar-la o abandonar-la.",
        game,
      });
    }

    const initialRoom = await prisma.room.findFirst({
      where: { isInitial: true },
      include: { objects: true, puzzle: true },
    });

    if (!initialRoom) {
      return res.status(404).json({
        message: "No s'ha trobat cap sala inicial",
      });
    }

    const game = await prisma.game.create({
      data: {
        userId,
        status: GameStatus.active,
        currentRoomId: initialRoom.id,
        state: defaultGameState(),
      },
      include: {
        currentRoom: {
          include: {
            objects: true,
            puzzle: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Partida iniciada correctament",
      game,
    });
  } catch (error) {
    console.error("Error iniciant la partida:", error);
    return res.status(500).json({
      message: "Error intern del servidor",
    });
  }
}
/**
 * Guarda el progrés de la partida.
 *
 * Nota:
 * Aquest endpoint (/save) s’utilitza com a persistència temporal del progrés.
 * La lògica definitiva del joc evolucionarà cap a endpoints d’acció (answer/hint/status),
 * de manera que el backend controli completament l’estat.
 *
 * FINAL (alineat amb GameState):
 * -Només acceptem state si és un GameState vàlid.
 */

export async function saveGameProgress(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuari no autenticat" });
    }

    const userId = Number(req.user.id);
    const { gameId, state } = req.body;

    if (!gameId) {
      return res.status(400).json({
        message: "Falta gameId",
      });
    }

    const existingGame = await prisma.game.findFirst({
      where: {
        id: Number(gameId),
        userId,
      },
    });

    if (!existingGame) {
      return res.status(404).json({
        message: "Partida no trobada",
      });
    }
    // Només guardem si l'state segueix el contracte GameState
    if (state === undefined || !isValidGameState(state)) {
      return res.status(400).json({
        message: "state invàlid (format GameState requerit)",
      });
    }

    const updatedGame = await prisma.game.update({
      where: {
        id: Number(gameId),
      },
      data: {
        state, // ja és GameState validat
      },
      include: {
        currentRoom: {
          include: {
            objects: true,
            puzzle: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Progrés guardat correctament",
      game: updatedGame,
    });
  } catch (error) {
    console.error("Error guardant el progrés:", error);
    return res.status(500).json({
      message: "Error intern del servidor",
    });
  }
}

/**
 * Retorna la partida activa de l'usuari autenticat.
 * - Requereix passar pel middleware authenticate (req.user definit).
 * - Amb userId @unique: fem findUnique i comprovem status.)
 */
export async function getMyActiveGame(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuari no autenticat" });
    }

    const userId = Number(req.user.id);

    const game = await prisma.game.findUnique({
      where: { userId },
      include: {
        currentRoom: {
          include: {
            objects: true,
            puzzle: true,
          },
        },
      },
    });

    if (!game || game.status !== GameStatus.active) {
      return res.status(404).json({
        message: "No s'ha trobat cap partida activa per aquest usuari",
      });
    }

    return res.status(200).json({ game });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error intern del servidor",
    });
  }
}

/**
 * Retorna l'última partida (sigui active o no).
 * Amb userId @unique: és la mateixa partida si existeix.
 */
export async function getMyLastGame(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuari no autenticat" });
    }

    const userId = Number(req.user.id);

    const game = await prisma.game.findFirst({
      where: { userId },
      include: {
        currentRoom: {
          include: {
            objects: true,
            puzzle: true,
          },
        },
      },
    });

    if (!game) {
      return res.status(404).json({
        message: "No s'ha trobat cap partida per aquest usuari",
      });
    }

    return res.status(200).json({ game });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error intern del servidor",
    });
  }
}

/**
 * POST /game/:id/answer
 * Task #108: valida la resposta del puzzle, marca com resolt i aplica canvis a la partida.
 *
 * - Si correcta: afegeix puzzleId a solvedPuzzleIds, suma score i avança a la següent sala (order + 1).
 * - Si incorrecta: retorna feedback genèric, penalitza score i manté la sala.
 */
export async function submitPuzzleAnswer(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuari no autenticat" });
    }

    const userId = Number(req.user.id);
    const gameId = Number(req.params.id);
    const { answer } = req.body;

    if (!answer || typeof answer !== "string") {
      return res.status(400).json({ message: "Cal enviar una resposta" });
    }

    // Carreguem partida activa + sala actual + puzzle
    const game = await prisma.game.findFirst({
      where: {
        id: gameId,
        userId,
        status: GameStatus.active,
      },
      include: {
        currentRoom: {
          include: {
            puzzle: true,
          },
        },
      },
    });

    if (!game || !game.currentRoom) {
      return res.status(404).json({ message: "Partida activa no trobada" });
    }

    const puzzle = game.currentRoom.puzzle;
    if (!puzzle) {
      return res.status(400).json({ message: "Aquesta sala no té puzzle" });
    }

    // Estat actual del joc (GameState)
    // Si per algun motiu està mal format, fem fallback a default
    const currentState: GameState = isValidGameState(game.state)
      ? (game.state as GameState)
      : defaultGameState();

    const isCorrect =
      answer.trim().toLowerCase() === puzzle.solution.trim().toLowerCase();

    // Task #107 aplicada dins #108
    if (!isCorrect) {
      const newState: GameState = {
        ...currentState,
        score: Math.max(
          GAME_CONSTANTS.MIN_SCORE,
          currentState.score - GAME_CONSTANTS.SCORE_WRONG_ANSWER_PENALTY,
        ),
      };

      await prisma.game.update({
        where: { id: gameId },
        data: {
          state: newState as unknown as Prisma.InputJsonValue,
        },
      });

      return res.status(200).json({
        correct: false,
        message: "La resposta no és correcta. Torna-ho a intentar.",
        state: newState,
      });
    }

    // Task #109 aplicada dins #108
    const solved = new Set(currentState.solvedPuzzleIds.map(Number));
    solved.add(puzzle.id);

    const newState: GameState = {
      ...currentState,
      solvedPuzzleIds: Array.from(solved),
      score: currentState.score + GAME_CONSTANTS.SCORE_CORRECT_ANSWER,
    };

    // Progressió lineal per Room.order
    const currentOrder = game.currentRoom.order;
    const nextRoom = await prisma.room.findUnique({
      where: { order: currentOrder + 1 },
    });

    // Hi ha sala següent-> avançar
    if (nextRoom) {
      const updatedGame = await prisma.game.update({
        where: { id: gameId },
        data: {
          currentRoomId: nextRoom.id,
          state: newState as unknown as Prisma.InputJsonValue,
        },
        include: {
          currentRoom: { include: { objects: true, puzzle: true } },
        },
      });

      return res.status(200).json({
        correct: true,
        completed: false,
        game: updatedGame,
        state: newState,
      });
    }

    // No hi ha següent sala-> partida completada
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        status: GameStatus.completed,
        currentRoomId: null,
        state: newState as unknown as Prisma.InputJsonValue,
      },
    });

    return res.status(200).json({
      correct: true,
      completed: true,
      game: updatedGame,
      state: newState,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error intern del servidor" });
  }
}
