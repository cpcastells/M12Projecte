import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import {
  getMyActiveGame,
  getMyLastGame,
  startGame,
  updateGameStatus,
  submitPuzzleAnswer,
} from "../controllers/game.controller";

const router = Router();

/**
 * Rutes de joc protegides:
 * - Cal estar autenticat (JWT) per consultar la teva partida.
 */
router.get("/me/active", authenticate, getMyActiveGame);
router.get("/me/last", authenticate, getMyLastGame);
router.post("/start", authenticate, startGame);
router.patch("/:id/status", authenticate, updateGameStatus);
router.post("/:id/puzzle", authenticate, submitPuzzleAnswer);

export default router;
