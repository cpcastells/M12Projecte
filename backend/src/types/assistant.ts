import type { Hint, Puzzle, Room } from "@prisma/client";

/**
 * Tipus auxiliars per a l'assistent ABYSS AI.
 *
 * Es deriven directament dels models de Prisma per garantir que el contracte
 * amb el servei d'OpenAI segueixi el schema sense duplicació.
 */

export type AssistantRoomContext = Pick<Room, "name" | "description">;

export type AssistantPuzzleContext = Pick<Puzzle, "statement" | "solution"> & {
  hints: Pick<Hint, "order" | "text">[];
};

export type AskAssistantInput = {
  room: AssistantRoomContext;
  puzzle: AssistantPuzzleContext;
  question: string;
};
