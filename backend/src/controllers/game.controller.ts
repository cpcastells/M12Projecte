import type { Request, Response } from "express";
import { prisma } from "../db/prisma";

/**
 * Crea la primera sala de prova a la base de dades.
 * Ruta temporal només per desenvolupament.
 */
export async function seedRoom(req: Request, res: Response) {
  try {
    const existingRoom = await prisma.room.findUnique({
      where: { code: "room1" },
    });

    if (existingRoom) {
      return res.status(400).json({
        message: "La sala room1 ja existeix",
      });
    }

    const room = await prisma.room.create({
      data: {
        code: "room1",
        name: "Laboratori abandonat",
        description:
          "Una sala fosca amb ordinadors espatllats i una porta bloquejada.",
        isInitial: true,

        objects: {
          create: [
            {
              name: "Taula",
              description: "Hi ha una nota amagada sota la taula.",
              type: "note",
              action: "show-note",
            },
            {
              name: "Porta",
              description: "La porta necessita un codi de 4 dígits.",
              type: "door",
              action: "open-door",
            },
            {
              name: "Terminal",
              description: "Un terminal antic demana una contrasenya.",
              type: "terminal",
              action: "validate-code",
            },
          ],
        },

        puzzle: {
          create: {
            title: "Codi de la porta",
            statement: "Troba els números amagats a la sala.",
            solution: "4281",
            reward: "Porta desbloquejada",
          },
        },
      },
      include: {
        objects: true,
        puzzle: true,
      },
    });

    return res.status(201).json(room);
  } catch (error) {
    console.error("Error creant la sala:", error);

    return res.status(500).json({
      message: "Error intern del servidor",
    });
  }
}

/**
 * Inicia una nova partida per a l'usuari autenticat.
 */
export async function startGame(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuari no autenticat" });
    }

    const userId = Number(req.user.id);

    const initialRoom = await prisma.room.findFirst({
      where: { isInitial: true },
    });

    if (!initialRoom) {
      return res.status(404).json({
        message: "No s'ha trobat cap sala inicial",
      });
    }

    const game = await prisma.game.create({
      data: {
        userId,
        status: "active",
        currentRoomId: initialRoom.id,
        state: {
          inventory: [],
          solvedPuzzles: [],
          collectedObjects: [],
        },
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
 * Guarda el progrés de la partida activa de l'usuari.
 */
export async function saveGameProgress(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuari no autenticat" });
    }

    const userId = Number(req.user.id);
    const {
      gameId,
      currentRoomId,
      inventory,
      solvedPuzzles,
      collectedObjects,
      status,
    } = req.body;

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

    const updatedGame = await prisma.game.update({
      where: {
        id: Number(gameId),
      },
      data: {
        currentRoomId:
          currentRoomId !== undefined
            ? Number(currentRoomId)
            : existingGame.currentRoomId,
        status: status ?? existingGame.status,
        state: {
          inventory: Array.isArray(inventory) ? inventory : [],
          solvedPuzzles: Array.isArray(solvedPuzzles) ? solvedPuzzles : [],
          collectedObjects: Array.isArray(collectedObjects)
            ? collectedObjects
            : [],
        },
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
 * - Si no hi ha partida activa, retorna 404 amb missatge clar.
 */
export async function getMyActiveGame(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuari no autenticat" });
    }

    const userId = Number(req.user.id);

    const game = await prisma.game.findFirst({
      where: {
        userId,
        status: "active",
      },
      orderBy: { createdAt: "desc" },
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
 * Útil per mostrar historial / resume last.
 */
export async function getMyLastGame(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuari no autenticat" });
    }

    const userId = Number(req.user.id);

    const game = await prisma.game.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
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
