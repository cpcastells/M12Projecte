import type { Request, Response } from "express";
import type { Prisma, Hint } from "@prisma/client";
import { prisma } from "../db/prisma";
import type { GameState } from "../types/game";
import { defaultGameState, isValidGameState } from "../utils/gameState";
import { GameStatus } from "@prisma/client";
import { GAME_CONSTANTS } from "../constants/game.constants";

/**
 * Include reutilitzable per la sala actual.
 * Exclou puzzle.solution per seguretat (el frontend no l'ha de rebre mai).
 */
const roomInclude = {
  objects: true,
  puzzle: {
    select: {
      id: true,
      roomId: true,
      title: true,
      statement: true,
      reward: true,
    },
  },
} as const;

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
        include: { currentRoom: { include: roomInclude } },
      });

      return res.status(200).json({
        message: "Ja tens una partida. Pots continuar-la o abandonar-la.",
        game,
      });
    }

    const initialRoom = await prisma.room.findFirst({
      where: { isInitial: true },
      include: roomInclude,
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
        currentRoom: { include: roomInclude },
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
        currentRoom: { include: roomInclude },
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
        currentRoom: { include: roomInclude },
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
        currentRoom: { include: roomInclude },
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
/*Funció que penalitza resta punts , guarda estado nuevo y devuelve respuesta error
export async function handleWrongAnswer(req : Request, res : Response) {

}
//Puzzles resueltos, save + desbloquear
export async function handleCorrectAnswer(req : Request, res : Response) {
*/

type ActiveGameWithPuzzle = Prisma.GameGetPayload<{
  include: {
    currentRoom: {
      include: {
        puzzle: true;
      };
    };
  };
}>;

async function findActiveGameWithPuzzle(gameId: number, userId: number) {
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
    return { error: "Partida activa no trobada" as const };
  }

  if (!game.currentRoom.puzzle) {
    return { error: "Aquesta sala no té puzzle" as const };
  }

  return { game };
}

async function handleWrongAnswer(gameId: number, currentState: GameState) {
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

  return {
    correct: false,
    message: "La resposta no és correcta. Torna-ho a intentar.",
    state: newState,
  };
}

async function handleCorrectAnswer(
  gameId: number,
  game: ActiveGameWithPuzzle,
  currentState: GameState,
) {
  const puzzle = game.currentRoom!.puzzle!;

  const solved = new Set(currentState.solvedPuzzleIds.map(Number));
  solved.add(puzzle.id);

  const currentOrder = game.currentRoom!.order;

  const currentUnlockedRoomIds = Array.isArray(currentState.unlockedRoomIds)
    ? currentState.unlockedRoomIds
    : [1];

  const nextRoom = await prisma.room.findUnique({
    where: { order: currentOrder + 1 },
  });

  const updatedUnlockedRoomIds =
    nextRoom && !currentUnlockedRoomIds.includes(nextRoom.id)
      ? [...currentUnlockedRoomIds, nextRoom.id]
      : currentUnlockedRoomIds;

  const newState: GameState = {
    ...currentState,
    solvedPuzzleIds: Array.from(solved),
    score: currentState.score + GAME_CONSTANTS.SCORE_CORRECT_ANSWER,
    unlockedRoomIds: updatedUnlockedRoomIds,
  };

  if (nextRoom) {
    const advanceState: GameState = {
      ...newState,
      hintsUsed: 0,
    };

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        currentRoomId: nextRoom.id,
        state: advanceState as unknown as Prisma.InputJsonValue,
      },
      include: {
        currentRoom: { include: roomInclude },
      },
    });

    return {
      correct: true,
      completed: false,
      unlockedRoom: nextRoom,
      game: updatedGame,
      state: advanceState,
    };
  }

  const updatedGame = await prisma.game.update({
    where: { id: gameId },
    data: {
      status: GameStatus.completed,
      currentRoomId: null,
      state: newState as unknown as Prisma.InputJsonValue,
    },
  });

  return {
    correct: true,
    completed: true,
    unlockedRoom: null,
    game: updatedGame,
    state: newState,
  };
}

/**
 * POST /game/:id/answer
 * Task #108: valida la resposta del puzzle, marca com resolt i aplica canvis a la partida.
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

    const result = await findActiveGameWithPuzzle(gameId, userId);

    if ("error" in result) {
      const status = result.error === "Aquesta sala no té puzzle" ? 400 : 404;

      return res.status(status).json({ message: result.error });
    }

    const { game } = result;
    const puzzle = game.currentRoom!.puzzle!;

    const currentState: GameState = isValidGameState(game.state)
      ? (game.state as GameState)
      : defaultGameState();

    const isCorrect =
      answer.trim().toLowerCase() === puzzle.solution.trim().toLowerCase();

    if (!isCorrect) {
      const response = await handleWrongAnswer(gameId, currentState);
      return res.status(200).json(response);
    }

    const response = await handleCorrectAnswer(gameId, game, currentState);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error intern del servidor" });
  }
}

/**
 * POST /game/:id/hint
 * Sol·licita una pista per al puzzle de la sala actual.
 *
 * - 3 pistes per sala. El comptador hintsUsed es reinicia al canviar de sala.
 * - Cada pista penalitza SCORE_HINT_PENALTY punts.
 * - Retorna el text de la pista corresponent (ordenat per Hint.order).
 */
export async function requestHint(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuari no autenticat" });
    }

    const userId = Number(req.user.id);
    const gameId = Number(req.params.id);

    const game = await prisma.game.findFirst({
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

    if (!game || !game.currentRoom) {
      return res.status(404).json({ message: "Partida activa no trobada" });
    }

    const puzzle = game.currentRoom.puzzle;
    if (!puzzle) {
      return res.status(400).json({ message: "Aquesta sala no té puzzle" });
    }

    const currentState: GameState = isValidGameState(game.state)
      ? (game.state as GameState)
      : defaultGameState();

    if (currentState.hintsUsed >= GAME_CONSTANTS.MAX_HINTS) {
      return res
        .status(400)
        .json({ message: "No queden pistes per aquesta sala" });
    }

    const hint: Hint | undefined = puzzle.hints[currentState.hintsUsed];
    if (!hint) {
      return res
        .status(400)
        .json({ message: "No hi ha més pistes disponibles" });
    }

    const newState: GameState = {
      ...currentState,
      hintsUsed: currentState.hintsUsed + 1,
      score: Math.max(
        GAME_CONSTANTS.MIN_SCORE,
        currentState.score - GAME_CONSTANTS.SCORE_HINT_PENALTY,
      ),
    };

    await prisma.game.update({
      where: { id: gameId },
      data: {
        state: newState as unknown as Prisma.InputJsonValue,
      },
    });

    return res.status(200).json({
      hint: hint.text,
      hintsUsed: newState.hintsUsed,
      hintsRemaining: GAME_CONSTANTS.MAX_HINTS - newState.hintsUsed,
      state: newState,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error intern del servidor" });
  }
}
