import type { GameResponse, PuzzleAnswerResponse } from "@/types/game";
import { ENDPOINTS } from "@/services/endpoints";
import { request } from "@/services/apiClient";

export const startNewGame = (): Promise<GameResponse> =>
  request<GameResponse>(ENDPOINTS.game.start, "POST");

export const getActiveGame = (): Promise<GameResponse> =>
  request<GameResponse>(ENDPOINTS.game.active);

export const getLastGame = (): Promise<GameResponse> =>
  request<GameResponse>(ENDPOINTS.game.last);

export const updateGameStatus = (
  gameId: number,
  status: "abandoned" | "completed",
): Promise<GameResponse> =>
  request<GameResponse>(ENDPOINTS.game.updateStatus(gameId), "PATCH", {
    status,
  });

export const submitPuzzleAnswer = (
  gameId: number,
  answer: string,
): Promise<PuzzleAnswerResponse> =>
  request<PuzzleAnswerResponse>(ENDPOINTS.game.submitPuzzle(gameId), "POST", {
    answer,
  });
