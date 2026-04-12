import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import {
  getMyActiveGame,
  getMyLastGame,
  startGame,
  saveGameProgress,
  submitPuzzleAnswer,
} from "../controllers/game.controller";

const router = Router();

// Iniciar partida
router.post("/start", authenticate, startGame);

// Guardar progrés
// Nota:
// Aquest endpoint (`/save`) s’utilitza com a persistència temporal del progrés.
// En futures iteracions, la lògica del joc evolucionarà cap a endpoints
// d’acció específics (validar resposta, demanar pista, abandonar/completar),
// de manera que el backend controli completament l’estat de la partida.
//
// Exemples previstos (quan disposem del controller corresponent):
// POST  /game/:id/answer  -> validar resposta del puzzle i avançar
// POST  /game/:id/hint    -> demanar pista i aplicar penalització
// PATCH /game/:id/status  -> abandonar o completar la partida
router.post("/save", authenticate, saveGameProgress);

// Validar resposta del puzzle (task #108)
router.post("/:id/answer", authenticate, submitPuzzleAnswer);

// Partida activa
router.get("/me/active", authenticate, getMyActiveGame);

// Última partida
router.get("/me/last", authenticate, getMyLastGame);

export default router;
