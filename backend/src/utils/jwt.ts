import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

/**
 * Tipus del payload que guardem dins el JWT.
 *
 * Definim explícitament quines dades viatgen dins el token per evitar errors
 */
export type JwtPayload = {
  sub: number; // Identificador únic de l'usuari (id)
  email: string; // Email de l'usuari autenticat
  username: string; // Nom d'usuari
  role: string; // Rol de l'usuari (USER, ADMIN)
};

/**
 * Genera un token JWT signat amb una clau secreta.
 *
 * Aquest token s'utilitza després per autenticar
 * les peticions a rutes protegides del backend.
 */
export function signToken(payload: JwtPayload) {
  // Obtenim el secret des de les variables d'entorn
  const secret = process.env.TOKEN_SECRET;
  if (!secret) {
    // Si no existeix el secret, parem l'aplicació
    // perquè sense això no es poden signar tokens de forma segura
    throw new Error("TOKEN_SECRET no està definit");
  }

  // Temps de vida del token (per defecte 7 dies)
  const expiresIn = (process.env.TOKEN_EXPIRES_IN ??
    "7d") as SignOptions["expiresIn"];

  // Signem el token amb el payload i la configuració definida
  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * Type guard propi.
 *
 * Aquesta funció comprova que el contingut descodificat
 * del JWT té exactament l'estructura que esperem.
 *
 * Això és important perquè `jwt.verify` pot retornar
 * qualsevol objecte o fins i tot una string.
 */
function isMyJwtPayload(decoded: unknown): decoded is JwtPayload {
  if (!decoded || typeof decoded !== "object") return false;

  // Convertim a objecte genèric per poder comprovar camps
  const d = decoded as Record<string, unknown>;

  // Validem manualment cada propietat
  return (
    typeof d.sub === "number" &&
    typeof d.email === "string" &&
    typeof d.username === "string" &&
    typeof d.role === "string"
  );
}

/**
 * Verifica un token JWT rebut en una petició.
 *
 * - Comprova la signatura
 * - Comprova la caducitat
 * - Valida que el payload tingui el format correcte
 *
 * Si alguna cosa falla, llença un error.
 */
export function verifyToken(token: string): JwtPayload {
  const secret = process.env.TOKEN_SECRET;
  if (!secret) {
    throw new Error("TOKEN_SECRET no està definit");
  }

  // Decodifiquem el token (pot retornar objecte o string)
  const decoded = jwt.verify(token, secret);

  // Validem que el payload sigui del tipus correcte
  if (!isMyJwtPayload(decoded)) {
    throw new Error("Token payload invàlid");
  }

  // Retornem el payload ja validat i tipat
  return decoded;
}
