import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { getMyActiveGame, getMyLastGame } from "../controllers/game.controller";

const router = Router();

/**
 * Rutes de joc protegides:
 * - Cal estar autenticat (JWT) per consultar la teva partida.
 */
router.get("/me/active", authenticate, getMyActiveGame);

// Última partida (activa o no)
router.get("/me/last", authenticate, getMyLastGame);

export default router;
