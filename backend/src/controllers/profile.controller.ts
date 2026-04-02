import type { Request, Response } from "express";
import { prisma } from "../db/prisma";

/**
 * Retorna el perfil agregat de l'usuari autenticat.
 * Contracte adaptat a la lògica del frontend (ProfilePage):
 * - username
 * - email
 * - rank
 * - gamesPlayed
 * - completion
 * - attempts
 * - victories
 *
 * Nota: attempts encara no està definit al model de dades (state és Json variable),
 * així que retornem 0 fins que la lògica del joc defineixi com calcular-lo.
 */
export async function getMyProfile(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuari no autenticat" });
    }

    // Dades bàsiques
    const userId = Number(req.user.id);
    const { username, email } = req.user;

    // recuperem state de la partida per poder calcular els stats
    const games = await prisma.game.findMany({
      where: { userId },
      select: {
        status: true,
      },
    });

    const gamesPlayed = games.length;

    // Pendent de decidir quin valor utilitzarem (win, completed, etc.)
    const victories = games.filter((g) => g.status === "completed").length;

    // Percentatge de completat segons lògica actual (victòries / partides)
    const completion =
      gamesPlayed === 0 ? 0 : Math.round((victories / gamesPlayed) * 100);

    const attempts = 0; // encara no definit pel domini del joc

    // Rang simple derivat (regla de negoci)-> podem canviar els llindars si volem
    const rank =
      completion >= 80 ? "Elite" : completion >= 50 ? "Operative" : "Recruit";

    return res.status(200).json({
      username,
      email,
      rank,
      gamesPlayed,
      completion,
      attempts,
      victories,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error obtenint el perfil",
    });
  }
}
