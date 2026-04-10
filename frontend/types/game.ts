export type GameState = {
  attempts: number;
  cluesRevealed: string[];
};

export type GameRoom = {
  id: number;
  code: string;
  name: string;
};

export type Game = {
  id: number;
  status: "active" | "completed" | "abandoned";
  currentRoomId: number;
  currentRoom: GameRoom;
  state: GameState | null;
  createdAt: string;
};

export type GameResponse = { game: Game };

export type PuzzleAnswerResponse = {
  correct: boolean;
  completed?: boolean;
  nextRoomId?: number;
  attempts?: number;
  game?: Game;
};
