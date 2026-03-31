import type { Request, Response, NextFunction } from "express";
import { ROLES, type Role } from "../constants/roles";

/**
 * Tasca #60 Middleware d'autorització per rols.
 *
 * Comprova si l'usuari autenticat té un dels rols permesos
 * per accedir a una ruta determinada.
 */
export function authorizeRoles(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Usuari no autenticat" });
    }

    if (!allowedRoles.includes(req.user.role as Role)) {
      return res.status(403).json({
        message: "Accés denegat: rol insuficient",
      });
    }

    return next();
  };
}
