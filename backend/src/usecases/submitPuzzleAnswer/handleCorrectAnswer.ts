import { gameActionRepository } from "../../repositories/gameAction.repository";
import {
  applyCorrectAnswer,
  resetAttemptsForNextRoom,
  resetHintsForNextRoom,
} from "../../domain/submitPuzzleAnswer.logic";
import { GameState } from "../../types/game";

type GameForSubmitAnswer = {
  currentRoom: {
    order: number;
    puzzle: {
      id: number;
    };
  };
};

export async function handleCorrectAnswer(
  gameId: number,
  game: GameForSubmitAnswer,
  currentState: GameState,
) {
  // efectes de resposta correcta (domain)
  let newState = applyCorrectAnswer(currentState, game.currentRoom.puzzle.id);

  // buscar next room (repo)
  const nextRoom = await gameActionRepository.findNextRoomByOrder(
    game.currentRoom.order + 1,
  );

  // si NO hi ha next room -> completed
  if (!nextRoom) {
    const updatedGame = await gameActionRepository.completeGame(
      gameId,
      newState,
    );

    return {
      correct: true,
      completed: true,
      unlockedRoom: null,
      game: updatedGame,
      state: newState,
    };
  }

  // hi ha next room -> desbloquejar + reset hints + avançar
  const unlocked = newState.unlockedRoomIds;

  if (!unlocked.includes(nextRoom.id)) {
    newState = { ...newState, unlockedRoomIds: [...unlocked, nextRoom.id] };
  }

  // Reset pistes + intents
  const advanceState = resetAttemptsForNextRoom(
    resetHintsForNextRoom(newState),
  );

  const updatedGame = await gameActionRepository.advanceRoom(
    gameId,
    nextRoom.id,
    advanceState,
  );

  return {
    correct: true,
    completed: false,
    unlockedRoom: nextRoom,
    game: updatedGame,
    state: advanceState,
  };
}
