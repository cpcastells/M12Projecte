import { rankingRepository } from "../repositories/ranking.repository";

export async function getRankingUseCase(limit?: number) {
  const safeLimit = limit && limit > 0 && limit <= 50 ? limit : 10;

  const users = await rankingRepository.getTopUsersByCompletedGames(safeLimit);

  const ranking = users.map((user, index) => ({
    position: index + 1,
    userId: user.id,
    username: user.username,
    completedGames: user._count.games,
  }));

  return {
    status: 200,
    body: { ranking },
  };
}
