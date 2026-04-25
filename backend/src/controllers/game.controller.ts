import type { Request, Response } from "express";
import { requestHintUseCase } from "../usecases/requestHint.usecase";
import { submitPuzzleAnswerUseCase } from "../usecases/submitPuzzleAnswer.usecase";
import { startGameUseCase } from "../usecases/startGame.usecase";
import { saveGameProgressUseCase } from "../usecases/saveGameProgress.usecase";
import { getMyActiveGameUseCase } from "../usecases/getMyActiveGame.usecase";
import { getMyLastGameUseCase } from "../usecases/getMyLastGame.usecase";
import { registerObjectInteractionUseCase } from "../usecases/registerObjectInteraction.usecase";
import { patchGameUseCase } from "../usecases/patchGame.usecase";

/**
 * Inicia (o recupera) la partida de l'usuari autenticat.
 *
 * Model actual:
 * - 1 usuari = 1 partida (userId @unique)
 * - La sala inicial es determina amb Room.isInitial = true
 * - L'estat de joc es guarda a Game.state amb el contracte GameState
 *
 * Nota:
 * La lògica de creació/recuperació de la partida està encapsulada al startGameUseCase.
 */
export async function startGame(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Usuari no autenticat" });
  }

  const userId = Number(req.user.id);
  const result = await startGameUseCase(userId);

  return res.status(result.status).json(result.body);
}

/**
 * Guarda el progrés de la partida.
 *
 * Nota:
 * Aquest endpoint (/save) s’utilitza com a persistència temporal del progrés del client.
 * La lògica de negoci del joc (validar respostes, pistes, progressió) es gestiona
 * mitjançant endpoints d’acció específics (/answer, /hint).
 *
 * FINAL (alineat amb GameState):
 * -Només acceptem state si és un GameState vàlid.
 *- La validació i persistència es realitza al saveGameProgressUseCase.
 */
export async function saveGameProgress(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Usuari no autenticat" });
  }

  const userId = Number(req.user.id);
  const { gameId, state } = req.body;

  const result = await saveGameProgressUseCase(userId, gameId, state);
  return res.status(result.status).json(result.body);
}

/**
 * Retorna la partida activa de l'usuari autenticat.
 *
 * - Requereix passar pel middleware authenticate (req.user definit).
 * - La lògica de recuperació i validació de l'estat de la partida
 *   es delega al getMyActiveGameUseCase.
 */
export async function getMyActiveGame(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Usuari no autenticat" });
  }

  const result = await getMyActiveGameUseCase(req.user.id);

  return res.status(result.status).json(result.body);
}

/**
 * Retorna l'última partida (sigui active o no).
 *
 * - Requereix autenticació.
 * - La lògica de recuperació de la partida es gestiona al getMyLastGameUseCase.
 */
export async function getMyLastGame(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Usuari no autenticat" });
  }

  const userId = Number(req.user.id);

  const result = await getMyLastGameUseCase(userId);

  return res.status(result.status).json(result.body);
}
/**
 * POST /game/:id/answer
 *
 * Endpoint per validar la resposta del puzzle de la sala actual.
 * La lògica de validació, puntuació i progressió de la partida
 * es gestiona al submitPuzzleAnswerUseCase
 */
export async function submitPuzzleAnswer(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Usuari no autenticat" });
  }

  const userId = Number(req.user.id);
  const gameId = Number(req.params.id);
  const { answer } = req.body;

  const result = await submitPuzzleAnswerUseCase(userId, gameId, answer);
  return res.status(result.status).json(result.body);
}

/**
 * POST /game/:id/hint
 *
 * Endpoint per sol·licitar una pista del puzzle de la sala actual.
 * Les regles de negoci (límit de pistes, penalització i reset
 * es gestionen al requestHintUseCase.
 */
export async function requestHint(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Usuari no autenticat" });
  }

  const userId = Number(req.user.id);
  const gameId = Number(req.params.id);

  const result = await requestHintUseCase(userId, gameId);

  return res.status(result.status).json(result.body);
}
/**
 * POST /game/:id/interactions
 *
 * Endpoint per registrar una interacció sobre un objecte de la sala actual.
 * Exemples:
 * - consulted: l'usuari inspecciona un objecte
 * - activated: l'usuari activa un mecanisme
 * - used: l'usuari utilitza un objecte
 */
export async function registerObjectInteraction(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Usuari no autenticat" });
  }

  const userId = Number(req.user.id);
  const gameId = Number(req.params.id);
  const { objectId, interaction } = req.body;

  const result = await registerObjectInteractionUseCase(
    userId,
    gameId,
    Number(objectId),
    interaction,
  );

  return res.status(result.status).json(result.body);
}

/**
 * PATCH /game/:id
 *
 * Modifica camps controlats d'una partida. Actualment només permet la
 * transició active → ended (timer esgotat o abandonament manual) + endReason corresponent.
 * La lògica de whitelist i validació viu al patchGameUseCase.
 */
export async function patchGame(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Usuari no autenticat" });
  }

  const userId = Number(req.user.id);
  const gameId = Number(req.params.id);
  const result = await patchGameUseCase(userId, gameId, req.body);

  return res.status(result.status).json(result.body);
}
