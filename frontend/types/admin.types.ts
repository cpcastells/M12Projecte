// frontend/types/admin.ts

export type AdminUser = {
  id: number;
  email: string;
  username: string;
  role: "user" | "admin";
  _count?: {
    games: number;
  };
};

export type GameEndReason =
  | "success"
  | "timeExpired"
  | "attemptsExceeded"
  | "abandoned";

export type GameStatus = "active" | "completed" | "ended";

export type RecentGame = {
  id: number;
  status: GameStatus;
  endReason: GameEndReason | null;
  createdAt: string;
  score: number;
  hintsUsed: number;
};

export type UserStats = {
  gamesPlayed: number;
  gamesCompleted: number;
  gamesAbandoned: number;
  gamesTimeExpired: number;
  gamesActive: number;
  completionRate: number;
  totalHintsUsed: number;
  avgScore: number;
  maxScore: number;
  avgTimeFormatted: string;
  recentGames: RecentGame[];
};

export type UserStatsResponse = {
  user: AdminUser;
  stats: UserStats;
};
