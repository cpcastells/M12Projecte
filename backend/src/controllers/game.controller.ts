import type { Request, Response } from "express";
import { prisma } from "../db/prisma";

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
