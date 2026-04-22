import { GameStatus } from "@prisma/client";
import { gameActionRepository } from "../repositories/gameAction.repository";

/**
 * Use case: modificar camps controlats d'una partida.
 *
 * Whitelist estricta: només s'accepta la transició `active → abandoned`.
 * Qualsevol altra clau al body és rebutjada amb 400. Les transicions
 * `active → completed` es fan exclusivament des del flux de resposta correcta
 * (handleCorrectAnswer); aquest endpoint no hi ha manera de forçar-les.
 */
const ALLOWED_STATUSES: Set<GameStatus> = new Set([GameStatus.abandoned]);

export async function patchGameUseCase(
  userId: number,
  gameId: number,
  patch: unknown,
) {
  try {
    if (!gameId) {
      return { status: 400, body: { message: "Falta gameId" } };
    }

    if (!patch || typeof patch !== "object") {
      return { status: 400, body: { message: "Patch invàlid" } };
    }

    const body = patch as Record<string, unknown>;
    const allowedKeys = ["status"];
    const unknownKeys = Object.keys(body).filter(
      (k) => !allowedKeys.includes(k),
    );
    if (unknownKeys.length > 0) {
      return {
        status: 400,
        body: {
          message: `Camps no permesos: ${unknownKeys.join(", ")}. Només s'accepta "status".`,
        },
      };
    }

    const nextStatus = body.status;
    if (
      typeof nextStatus !== "string" ||
      !ALLOWED_STATUSES.has(nextStatus as GameStatus)
    ) {
      return {
        status: 400,
        body: {
          message: `Transició no permesa. Valors acceptats: ${[...ALLOWED_STATUSES].join(", ")}.`,
        },
      };
    }

    const existing = await gameActionRepository.findActiveByIdAndUser(
      gameId,
      userId,
    );
    if (!existing) {
      return {
        status: 404,
        body: { message: "Partida activa no trobada" },
      };
    }

    const updated = await gameActionRepository.updateStatus(
      gameId,
      nextStatus as GameStatus,
    );

    return {
      status: 200,
      body: {
        message: "Partida actualitzada",
        game: updated,
      },
    };
  } catch (error) {
    console.error("Error modificant la partida:", error);
    return { status: 500, body: { message: "Error intern del servidor" } };
  }
}
