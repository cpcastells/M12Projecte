/** URL base de l'API, configurable via variable d'entorn `NEXT_PUBLIC_API_URL`. */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/**
 * Mapa centralitzat de tots els endpoints de l'API.
 * Afegir aquí qualsevol endpoint nou per evitar URLs hardcodejades als serveis.
 */
export const ENDPOINTS = {
  /** Endpoints d'autenticació */
  auth: {
    /** POST — Inicia sessió amb email i password */
    login: `${BASE_URL}/auth/login`,
    /** POST — Registra un nou usuari amb username, email i password */
    register: `${BASE_URL}/auth/register`,
  },
} as const;
