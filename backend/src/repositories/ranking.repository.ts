import { prisma } from "../prisma/client";
import { GameStatus } from "@prisma/client";

export const rankingRepository = {
  getTopUsersByCompletedGames(limit: number) {
    return prisma.user.findMany({
      where: {
        games: {
          some: {
            status: GameStatus.completed,
          },
        },
      },
      select: {
        id: true,
        username: true,
        _count: {
          select: {
            games: {
              where: {
                status: GameStatus.completed,
              },
            },
          },
        },
      },
      orderBy: {
        games: {
          _count: "desc",
        },
      },
      take: limit,
    });
  },
};
