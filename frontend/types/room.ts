export type InteractiveObject = {
  id: number;
  name: string;
  description: string;
  type: string;
  isInteractive: boolean;
  isVisible: boolean;
  action: string | null;
};

export type Puzzle = {
  id: number;
  title: string;
  statement: string;
};

export type Room = {
  id: number;
  code: string;
  name: string;
  description: string;
  image: string | null;
  objects: InteractiveObject[];
  puzzle: Puzzle | null;
};

export type RoomResponse = { room: Room };
