import { gameActionRepository } from "../../repositories/gameAction.repository";
import {
  applyWrongAnswer,
  hasExceededAttempts,
} from "../../domain/submitPuzzleAnswer.logic";
import { GameState } from "../../types/game";
import { GameEndReason } from "@prisma/client";

export async function handleWrongAnswer(
  gameId: number,
  userId: number,
  currentState: GameState,
) {
  const newState = applyWrongAnswer(currentState);

  // Si s'han esgotat els intents, la partida acaba aquí
  if (hasExceededAttempts(newState)) {
    const endedGame = await gameActionRepository.endActiveGame(
      gameId,
      userId,
      GameEndReason.attemptsExceeded,
      newState,
    );

    return {
      correct: false,
      gameOver: true,
      endReason: GameEndReason.attemptsExceeded,
      game: endedGame,
      state: newState,
    };
  }

  await gameActionRepository.updateState(gameId, newState, newState.score);

  return {
    correct: false,
    gameOver: false,
    message: "La resposta no és correcta. Torna-ho a intentar.",
    state: newState,
  };
}
