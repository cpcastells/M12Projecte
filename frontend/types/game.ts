// ─── Room & Objects ───────────────────────────────────────────────────────────

export type InteractiveObject = {
  id: number;
  roomId: number;
  name: string;
  description: string;
  type: string;
  isInteractive: boolean;
  isVisible: boolean;
  action: string | null;
};

export type Puzzle = {
  id: number;
  roomId: number;
  title: string;
  statement: string;
  reward: string | null;
};

export type Room = {
  id: number;
  code: string;
  name: string;
  description: string;
  image: string | null;
  order: number;
  isInitial: boolean;
  objects: InteractiveObject[];
  puzzle: Puzzle | null;
};

// ─── Game State ───────────────────────────────────────────────────────────────

/**
 * Estat intern del joc emmagatzemat al camp `state` (JSON) de la BD.
 * Reflecteix tot el progrés d'una partida en curs.
 */
export type GameState = {
  hintsUsed: number;
  maxHints: number;
  timeRemainingSeconds: number;
  score: number;
  solvedPuzzleIds: number[];
  collectedObjectIds: number[];
  usedObjectIds: number[];
};

export type Game = {
  id: number;
  status: "active" | "completed" | "abandoned";
  currentRoom: Room;
  state: GameState | null;
  createdAt: string;
};

// ─── API responses ────────────────────────────────────────────────────────────

export type GameResponse = { game: Game };

export type StartGameResponse = { game: Game };

export type SolveEnigmaRequest = {
  gameId: number;
  puzzleId: number;
  answer: string;
};

export type SolveEnigmaResponse = {
  correct: boolean;
  message: string;
  nextRoom?: Room;
  game: Game;
};

export type UseHintRequest = {
  gameId: number;
  puzzleId: number;
};

export type UseHintResponse = {
  hint: string;
  hintsUsed: number;
  hintsRemaining: number;
  game: Game;
};

export type InteractObjectRequest = {
  gameId: number;
  objectId: number;
};

export type InteractObjectResponse = {
  message: string;
  object: InteractiveObject;
  game: Game;
};

export type UpdateGameStateRequest = {
  gameId: number;
  state: Partial<GameState>;
};

export type UpdateGameStateResponse = { game: Game };

// ─── Admin ────────────────────────────────────────────────────────────────────

export type CreateRoomRequest = {
  code: string;
  name: string;
  description: string;
  image?: string;
  isInitial?: boolean;
};

export type UpdateRoomRequest = Partial<CreateRoomRequest>;

export type CreatePuzzleRequest = {
  roomId: number;
  title: string;
  statement: string;
  solution: string;
  reward?: string;
};

export type UpdatePuzzleRequest = Partial<Omit<CreatePuzzleRequest, "roomId">>;

export type RoomsListResponse = { rooms: Room[] };
export type RoomResponse = { room: Room };
export type PuzzleResponse = { puzzle: Puzzle };
export type DeleteResponse = { message: string };
