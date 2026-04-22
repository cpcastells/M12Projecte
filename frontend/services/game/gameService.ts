import { authRequest } from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import type {
  GameResponse,
  StartGameResponse,
  SolveEnigmaResponse,
  UseHintResponse,
  UpdateGameStateResponse,
  GameState,
} from "@/types/game";

export function startGame(): Promise<StartGameResponse> {
  return authRequest<StartGameResponse>(ENDPOINTS.game.start, "POST");
}

export function getActiveGame(): Promise<GameResponse> {
  return authRequest<GameResponse>(ENDPOINTS.game.activeGame);
}

export function getLastGame(): Promise<GameResponse> {
  return authRequest<GameResponse>(ENDPOINTS.game.lastGame);
}

/**
 * Envia un patch parcial del GameState. Només els camps permesos pel backend
 * (actualment timeRemainingSeconds) són aplicats; la resta són ignorats.
 */
export function saveGame(
  gameId: number,
  patch: Pick<GameState, "timeRemainingSeconds">,
): Promise<UpdateGameStateResponse> {
  return authRequest<UpdateGameStateResponse>(ENDPOINTS.game.save, "POST", {
    gameId,
    state: patch,
  });
}

export function submitAnswer(
  gameId: number,
  answer: string,
): Promise<SolveEnigmaResponse> {
  return authRequest<SolveEnigmaResponse>(
    ENDPOINTS.game.answer(gameId),
    "POST",
    { answer },
  );
}

export function requestHint(gameId: number): Promise<UseHintResponse> {
  return authRequest<UseHintResponse>(ENDPOINTS.game.hint(gameId), "POST");
}

/**
 * Marca la partida com abandonada. Única transició permesa al backend
 * via PATCH (whitelist estricta: active → abandoned).
 */
export function abandonGame(gameId: number): Promise<GameResponse> {
  return authRequest<GameResponse>(ENDPOINTS.game.patch(gameId), "PATCH", {
    status: "abandoned",
  });
}
