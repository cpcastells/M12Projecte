import { prisma } from "../db/prisma";
import { GameStatus, GameEndReason } from "@prisma/client";

export const rankingRepository = {
  getTopRanking(limit = 10) {
    return prisma.game.findMany({
      where: {
        status: GameStatus.completed,
        endReason: GameEndReason.success, // solo partidas ganadas
      },
      orderBy: [
        { score: "desc" }, // mayor score primero
        { updatedAt: "asc" }, // desempate (antes termina, mejor)
      ],
      take: limit,
      select: {
        id: true,
        score: true,
        updatedAt: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  },
};
