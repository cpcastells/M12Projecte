import type { RecentGame } from "./admin.types";

export type Rank = "Recruit" | "Operative" | "Elite";

export type ProfileUser = {
  username: string;
  email: string;
  rank: Rank;
};

export type ProfileStats = {
  gamesPlayed: number;
  gamesCompleted: number;
  gamesAbandoned: number;
  gamesTimeExpired: number;
  gamesActive: number;
  completionRate: number;
  victories: number;
  attempts: number;
  totalHintsUsed: number;
  avgScore: number;
  maxScore: number;
  avgTimeFormatted: string;
  recentGames: RecentGame[];
};

export type ProfileResponse = {
  user: ProfileUser;
  stats: ProfileStats;
};
