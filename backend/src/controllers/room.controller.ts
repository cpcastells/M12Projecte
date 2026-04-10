import type { Request, Response } from "express";
import { prisma } from "../db/prisma";

/**
 * Retorna les dades d'una sala per al joc.
 * Verifica que l'usuari té partida activa i que la sala està desbloquejada.
 * Mai retorna la solució del puzzle.
 */
export async function getRoom(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuari no autenticat" });
    }

    const userId = Number(req.user.id);
    const roomId = Number(req.params.id);

    const game = await prisma.game.findFirst({
      where: { userId, status: "active" },
      include: { currentRoom: true },
    });

    if (!game) {
      return res.status(403).json({ message: "No tens cap partida activa" });
    }

    // Verificar que la sala està desbloquejada:
    // La sala actual o qualsevol sala amb codi <= al codi de la sala actual
    const requestedRoom = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!requestedRoom) {
      return res.status(404).json({ message: "Sala no trobada" });
    }

    const isUnlocked = requestedRoom.code <= game.currentRoom.code;
    if (!isUnlocked) {
      return res.status(403).json({
        message: "No tens accés a aquesta sala",
        currentRoomId: game.currentRoomId,
      });
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        image: true,
        objects: {
          select: {
            id: true,
            name: true,
            description: true,
            type: true,
            isInteractive: true,
            isVisible: true,
            action: true,
          },
        },
        puzzle: {
          select: {
            id: true,
            title: true,
            statement: true,
            // Mai retornem la solució
          },
        },
      },
    });

    return res.status(200).json({ room });
  } catch (error) {
    return res.status(500).json({ message: "Error intern del servidor" });
  }
}
