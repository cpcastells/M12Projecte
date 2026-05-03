import { rankingRepository } from "../repositories/ranking.repository";

export async function getRankingUseCase(limit?: number) {
  const safeLimit = limit && limit > 0 && limit <= 50 ? limit : 10;

  const games = await rankingRepository.getTopRanking(safeLimit);

  const ranking = games.map((g, index) => ({
    position: index + 1,
    username: g.user.username,
    score: g.score,
    completedAt: g.updatedAt,
  }));

  return {
    status: 200,
    body: { ranking },
  };
}
