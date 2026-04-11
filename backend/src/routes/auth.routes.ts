import { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/authenticate";
import { requireAdmin } from "../middlewares/requireAdmin";

const router = Router();

/**
 * Rutes públiques (no requereixen autenticació)
 */
router.post("/login", login);
router.post("/register", register);

/**
 * Ruta protegida per comprovar el funcionament del JWT (Task #57).
 * Retorna l'usuari autenticat obtingut a partir del token.
 */
router.get("/me", authenticate, (req, res) => {
  return res.status(200).json({
    message: "Token OK",
    user: req.user,
  });
});

/**
 * Exemple de ruta protegida per rol ADMIN (Task #60).
 * Només accessible si l'usuari autenticat té rol d'administrador.
 */
router.get("/admin-only", authenticate, requireAdmin, (req, res) => {
  return res.status(200).json({
    message: "OK admin",
    user: req.user,
  });
});

export default router;
