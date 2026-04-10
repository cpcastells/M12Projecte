import type { Request, Response } from "express";
import { prisma } from "../db/prisma";
import type { Prisma } from "@prisma/client";

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

    // Ens assegurem que userId és numèric (compatibilitat amb Int a BD)
    const userId = Number(req.user.id);

    const game = await prisma.game.findFirst({
      where: {
        userId, // ús de la variable numèrica
        status: "active",
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        currentRoom: true,
        state: true,
        createdAt: true,
      },
    });

    if (!game) {
      return res.status(404).json({
        message: "No s'ha trobat cap partida activa per aquest usuari",
      });
    }

    return res.status(200).json({ game });
  } catch (error) {
    return res.status(500).json({ message: "Error intern del servidor" });
  }
}

/**
 * Retorna l'última partida (sigui active o no).
 * Útil per mostrar historial / "resume last".
 */
export async function getMyLastGame(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuari no autenticat" });
    }

    // Es força la conversió del identificador d’usuari obtingut del JWT a tipus numèric
    // per garantir la compatibilitat amb el tipus Int definit al model de dades.
    const userId = Number(req.user.id);

    const game = await prisma.game.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        currentRoom: true,
        state: true,
        createdAt: true,
      },
    });

    if (!game) {
      return res.status(404).json({
        message: "No s'ha trobat cap partida per aquest usuari",
      });
    }

    return res.status(200).json({ game });
  } catch (error) {
    return res.status(500).json({ message: "Error intern del servidor" });
  }
}

/**
 * Crea una nova partida per a l'usuari autenticat.
 * - Si ja té una partida activa, retorna 409.
 * - Assigna la sala inicial (isInitial: true) com a currentRoom.
 */
export async function startGame(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuari no autenticat" });
    }

    const userId = Number(req.user.id);

    const existingActive = await prisma.game.findFirst({
      where: { userId, status: "active" },
    });

    if (existingActive) {
      return res.status(409).json({
        message:
          "Ja tens una partida activa. Abandona-la abans de començar-ne una de nova.",
      });
    }

    const initialRoom = await prisma.room.findFirst({
      where: { isInitial: true },
    });

    if (!initialRoom) {
      return res
        .status(500)
        .json({ message: "No s'ha configurat cap sala inicial" });
    }

    const game = await prisma.game.create({
      data: {
        userId,
        currentRoomId: initialRoom.id,
        status: "active",
        state: { attempts: 0, cluesRevealed: [] } satisfies Prisma.JsonObject,
      },
      select: {
        id: true,
        status: true,
        currentRoomId: true,
        currentRoom: { select: { id: true, code: true, name: true } },
        state: true,
        createdAt: true,
      },
    });

    return res.status(201).json({ game });
  } catch (error) {
    return res.status(500).json({ message: "Error intern del servidor" });
  }
}

/**
 * Actualitza l'estat d'una partida (abandoned/completed).
 * Verifica que la partida pertany a l'usuari autenticat.
 */
export async function updateGameStatus(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuari no autenticat" });
    }

    const userId = Number(req.user.id);
    const gameId = Number(req.params.id);
    const { status } = req.body;

    if (!["abandoned", "completed"].includes(status)) {
      return res
        .status(400)
        .json({
          message: "Estat invàlid. Ha de ser 'abandoned' o 'completed'.",
        });
    }

    const game = await prisma.game.findFirst({
      where: { id: gameId, userId },
    });

    if (!game) {
      return res.status(404).json({ message: "Partida no trobada" });
    }

    if (game.status !== "active") {
      return res
        .status(400)
        .json({ message: "Només es pot modificar una partida activa" });
    }

    const updated = await prisma.game.update({
      where: { id: gameId },
      data: { status },
      select: {
        id: true,
        status: true,
        currentRoomId: true,
        state: true,
        createdAt: true,
      },
    });

    return res.status(200).json({ game: updated });
  } catch (error) {
    return res.status(500).json({ message: "Error intern del servidor" });
  }
}

/**
 * Valida la resposta d'un puzzle i avança la partida si és correcta.
 * - Si és correcta i hi ha sala següent: actualitza currentRoomId.
 * - Si és correcta i és l'última sala: marca la partida com a completada.
 * - Si és incorrecta: incrementa el comptador d'intents.
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

    const game = await prisma.game.findFirst({
      where: { id: gameId, userId, status: "active" },
      include: {
        currentRoom: {
          include: { puzzle: true },
        },
      },
    });

    if (!game) {
      return res.status(404).json({ message: "Partida activa no trobada" });
    }

    const puzzle = game.currentRoom.puzzle;
    if (!puzzle) {
      return res.status(400).json({ message: "Aquesta sala no té puzzle" });
    }

    const isCorrect =
      answer.trim().toLowerCase() === puzzle.solution.trim().toLowerCase();

    if (!isCorrect) {
      const currentState = (game.state as Prisma.JsonObject) ?? {};
      const attempts =
        (typeof currentState.attempts === "number"
          ? currentState.attempts
          : 0) + 1;

      await prisma.game.update({
        where: { id: gameId },
        data: { state: { ...currentState, attempts } },
      });

      return res.status(200).json({ correct: false, attempts });
    }

    // Resposta correcta: buscar la sala següent
    const currentRoomCode = game.currentRoom.code;
    const nextRoomCode = String(Number(currentRoomCode) + 1).padStart(
      currentRoomCode.length,
      "0",
    );

    const nextRoom = await prisma.room.findUnique({
      where: { code: nextRoomCode },
    });

    if (nextRoom) {
      const updated = await prisma.game.update({
        where: { id: gameId },
        data: {
          currentRoomId: nextRoom.id,
          state: { attempts: 0, cluesRevealed: [] },
        },
        select: {
          id: true,
          status: true,
          currentRoomId: true,
          currentRoom: { select: { id: true, code: true, name: true } },
          state: true,
        },
      });

      return res.status(200).json({
        correct: true,
        completed: false,
        nextRoomId: nextRoom.id,
        game: updated,
      });
    }

    // Última sala: marcar com a completada
    const updated = await prisma.game.update({
      where: { id: gameId },
      data: { status: "completed" },
      select: {
        id: true,
        status: true,
        currentRoomId: true,
        state: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      correct: true,
      completed: true,
      game: updated,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error intern del servidor" });
  }
}
