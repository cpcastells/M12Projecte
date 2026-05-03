import { prisma } from "../prisma/client";
import { GameStatus, GameEndReason } from "@prisma/client";

type GameState = {
  timeRemainingSeconds?: number;
  lastTimerUpdate?: string | null;
  isTimerRunning?: boolean;
  [key: string]: unknown;
};

export async function getUpdatedGameTimer(gameId: number) {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
  });

  if (!game) {
    throw new Error("Game not found");
  }

  const state = (game.state ?? {}) as GameState;

  const remaining = state.timeRemainingSeconds ?? 1800;

  if (!state.lastTimerUpdate || !state.isTimerRunning) {
    return {
      game,
      timeRemainingSeconds: remaining,
      state,
    };
  }

  const elapsedSeconds = Math.floor(
    (Date.now() - new Date(state.lastTimerUpdate).getTime()) / 1000,
  );

  const timeRemainingSeconds = Math.max(0, remaining - elapsedSeconds);

  const updatedState = {
    ...state,
    timeRemainingSeconds,
    lastTimerUpdate: new Date().toISOString(),
    isTimerRunning: timeRemainingSeconds > 0,
  };

  const updatedGame = await prisma.game.update({
    where: { id: gameId },
    data: {
      state: updatedState,
      status: timeRemainingSeconds === 0 ? GameStatus.ended : game.status,
      endReason:
        timeRemainingSeconds === 0 ? GameEndReason.timeExpired : game.endReason,
    },
  });

  return {
    game: updatedGame,
    timeRemainingSeconds,
    state: updatedState,
  };
}

export function calculateRemainingTime(state: GameState) {
  const remaining = state.timeRemainingSeconds ?? 1800;

  if (!state.lastTimerUpdate || !state.isTimerRunning) {
    return remaining;
  }

  const elapsedSeconds = Math.floor(
    (Date.now() - new Date(state.lastTimerUpdate).getTime()) / 1000,
  );

  return Math.max(0, remaining - elapsedSeconds);
}

export async function persistGameTimer(
  gameId: number,
  timeRemainingSeconds: number,
) {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
  });

  if (!game) {
    throw new Error("Game not found");
  }

  const state = (game.state ?? {}) as GameState;

  const updatedState = {
    ...state,
    timeRemainingSeconds,
    lastTimerUpdate: new Date().toISOString(),
    isTimerRunning: timeRemainingSeconds > 0,
  };

  return prisma.game.update({
    where: { id: gameId },
    data: {
      state: updatedState,
      status: timeRemainingSeconds === 0 ? GameStatus.ended : game.status,
      endReason:
        timeRemainingSeconds === 0 ? GameEndReason.timeExpired : game.endReason,
    },
  });
}
