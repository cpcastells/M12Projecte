import { gameActionRepository } from "../repositories/gameAction.repository";
import { getStateOrDefault } from "../utils/gameState";
import type { GameState } from "../types/game";

/**
 * Use case: persistir camps de progrés temporal del client (client-driven).
 *
 * Aquest endpoint NO pot modificar camps de negoci (hintsUsed, score,
 * solvedPuzzleIds, unlockedRoomIds, ...). Aquests només es canvien des dels
 * use cases d'acció (submitPuzzleAnswer, requestHint, ...). Acceptar camps
 * arbitraris aquí va provocar un bug de sincronització: el client desava
 * una còpia local obsoleta i sobreescrivia el progrés actualitzat pel
 * backend.
 *
 * Camps permesos al patch:
 *   - timeRemainingSeconds: decrementat pel timer client-side.
 *
 * Qualsevol camp addicional és ignorat silenciosament.
 */
export type SaveGameProgressPatch = {
  timeRemainingSeconds?: number;
};

function extractAllowedPatch(raw: unknown): SaveGameProgressPatch | null {
  if (!raw || typeof raw !== "object") return null;
  const patch = raw as Record<string, unknown>;
  const allowed: SaveGameProgressPatch = {};
  if (typeof patch.timeRemainingSeconds === "number") {
    allowed.timeRemainingSeconds = Math.max(
      0,
      Math.floor(patch.timeRemainingSeconds),
    );
  }
  return allowed;
}

export async function saveGameProgressUseCase(
  userId: number,
  gameId: number,
  patch: unknown,
) {
  try {
    if (!gameId) {
      return { status: 400, body: { message: "Falta gameId" } };
    }

    const allowed = extractAllowedPatch(patch);
    if (!allowed) {
      return {
        status: 400,
        body: { message: "Patch de state invàlid" },
      };
    }

    const existing = await gameActionRepository.findActiveByIdAndUser(
      gameId,
      userId,
    );
    if (!existing) {
      return { status: 404, body: { message: "Partida no trobada" } };
    }

    const currentState = getStateOrDefault(existing.state);
    const nextState: GameState = {
      ...currentState,
      ...allowed,
    };

    const updatedGame = await gameActionRepository.saveGameProgress(
      userId,
      gameId,
      nextState,
    );

    if (!updatedGame) {
      return { status: 404, body: { message: "Partida no trobada" } };
    }

    return {
      status: 200,
      body: {
        message: "Progrés guardat correctament",
        game: updatedGame,
      },
    };
  } catch (error) {
    console.error("Error guardant el progrés:", error);
    return {
      status: 500,
      body: { message: "Error intern del servidor" },
    };
  }
}
