import { gameActionRepository } from "../../repositories/gameAction.repository";
import { applyWrongAnswer } from "../../domain/submitPuzzleAnswer.logic";

export async function handleWrongAnswer(gameId: number, currentState: any) {
  const newState = applyWrongAnswer(currentState);

  await gameActionRepository.updateState(gameId, newState, newState.score);

  return {
    correct: false,
    message: "La resposta no és correcta. Torna-ho a intentar.",
    state: newState,
  };
}
