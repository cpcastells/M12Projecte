import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { requireAdmin } from "../middlewares/requireAdmin";
import {
  adminListUsers,
  adminUpdateUserRole,
  adminDeleteUser,
} from "../controllers/admin.controller";

const router = Router();

// El router queda protegit: cal token + cal admin
router.use(authenticate, requireAdmin);

// GET /admin/users -> llistar usuaris
router.get("/users", adminListUsers);

// PATCH /admin/users/:id/role -> canviar rol
router.patch("/users/:id/role", adminUpdateUserRole);

// DELETE /admin/users/:id -> eliminar usuari (amb seguretat)
router.delete("/users/:id", adminDeleteUser);

export default router;
