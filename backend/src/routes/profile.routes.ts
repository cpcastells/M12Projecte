import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { getMyProfile } from "../controllers/profile.controller";

const router = Router();

/**
 * Rutes de perfil protegides
 */
router.get("/me", authenticate, getMyProfile);

export default router;
