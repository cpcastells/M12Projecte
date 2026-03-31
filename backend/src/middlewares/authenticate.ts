import type { Request, Response, NextFunction } from "express";
import { prisma } from "../db/prisma";
import { verifyToken } from "../utils/jwt";

/**
 * Funció auxiliar per extreure el token del header Authorization.
 *
 * Estàndard: Authorization: Bearer <token>
 *
 * Si el format no és correcte, retornem null.
 */
function getBearerToken(authHeader?: string) {
  if (!authHeader) return null;

  // Separem el header per espais: ["Bearer", "<token>"]
  const [type, token] = authHeader.split(" ");

  // Validem que sigui tipus Bearer i que existeixi un token real
  if (type?.toLowerCase() !== "bearer" || !token) return null;

  // Traiem espais extra per seguretat
  return token.trim();
}

/**
 * Middleware d'autenticació (Tasca #57-identificació d'usuari).
 *
 * Objectiu:
 * 1) Comprovar que arriba un JWT
 * 2) Verificar que és vàlid i no caducat (signatura + caducitat)
 * 3) Identificar l'usuari a BD (Prisma) a partir del sub (Id)
 * 4) Guardar l'usuari a req.user per poder-lo fer servir en rutes protegides
 *
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // 1) Extraiem el token del header Authorization
    const token = getBearerToken(req.headers.authorization);

    // Si no hi ha token, no deixem accedir a la ruta protegida
    if (!token) {
      return res.status(401).json({ message: "No es troba el Token" });
    }

    // 2) Verifiquem el token (si és invàlid o caducat, llençarà error)
    // verifyToken també valida l'estructura del payload amb un type guard
    const payload = verifyToken(token);

    // Assegurem que l'identificador d'usuari del token és numèric (int)
    // // (evita problemes de tipus quan es consulta la BD amb Prisma)
    if (typeof payload.sub !== "number") {
      return res.status(401).json({ message: "Token payload invàlid" });
    }

    // 3) Busquem l'usuari a la BD per assegurar:
    // - que existeix
    // - que el rol és l'actual (no confiem només en el token)
    // - que no estem treballant amb dades obsoletes
    const user = await prisma.user.findUnique({
      where: { id: payload.sub }, // payload.sub és l'id de l'usuari
      select: { id: true, email: true, role: true }, // retornem només el necessari
    });

    // Si el token és vàlid però l'usuari no existeix, deneguem accés
    if (!user) {
      return res.status(401).json({ message: "Usuari no trobat" });
    }

    // 4) Guardem l'usuari autenticat a req.user
    // Això permet que altres rutes/middlewares (ex: authorizeRoles) sàpiguen qui és.
    req.user = user;

    // Continuem amb la següent etapa (middleware següent o controlador)
    return next();
  } catch {
    // Si falla verifyToken o qualsevol error, retornem 401 (no autenticat)
    return res.status(401).json({ message: "Token invàlid o caducat" });
  }
}
