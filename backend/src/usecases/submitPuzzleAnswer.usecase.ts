import { gameActionRepository } from "../repositories/gameAction.repository";
import { isCorrectAnswer } from "../domain/submitPuzzleAnswer.logic";
import { getStateOrDefault } from "../utils/gameState";
import { handleWrongAnswer } from "./submitPuzzleAnswer/handleWrongAnswer";
import { handleCorrectAnswer } from "./submitPuzzleAnswer/handleCorrectAnswer";

/**
 * Use case: validar la resposta del puzzle actual.
 *
 * - Si és correcta: avança a la següent sala o finalitza el joc.
 * - Si és incorrecta: penalitza la puntuació.
 *
 * Aquest use case orquestra domain logic i accessos a repositoris,
 * però no conté lògica HTTP ni de persistència directa.
 */
export async function submitPuzzleAnswerUseCase(
  userId: number,
  gameId: number,
  answer: string,
) {
  try {
    // Validació entrada

    if (!answer || !answer.trim()) {
      return {
        status: 400,
        body: { message: "Resposta buida" },
      };
    }

    const game = await gameActionRepository.findActiveGameWithPuzzle(
      gameId,
      userId,
    );

    if (!game || !game.currentRoom) {
      return { status: 404, body: { message: "Partida activa no trobada" } };
    }

    const puzzle = game.currentRoom.puzzle;
    if (!puzzle) {
      return { status: 400, body: { message: "Aquesta sala no té puzzle" } };
    }

    const currentState = getStateOrDefault(game.state);

    const correct = isCorrectAnswer(answer, puzzle.solution);

    if (!correct) {
      const response = await handleWrongAnswer(gameId, userId, currentState);
      return { status: 200, body: response };
    }

    const gameForCorrectAnswer = {
      currentRoom: {
        order: game.currentRoom.order,
        puzzle: {
          id: puzzle.id,
        },
      },
    };

    const response = await handleCorrectAnswer(
      gameId,
      gameForCorrectAnswer,
      currentState,
    );
    return { status: 200, body: response };
  } catch (error) {
    console.error(error);
    return { status: 500, body: { message: "Error intern del servidor" } };
  }
}
