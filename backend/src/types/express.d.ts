/**
 * Extensió del tipus Request d'Express per afegir la propietat `user`,
 * que conté la informació bàsica de l'usuari autenticat obtinguda després
 * de validar el token JWT.
 */

import type { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, "id" | "email" | "username" | "role">;
    }
  }
}

export {};
