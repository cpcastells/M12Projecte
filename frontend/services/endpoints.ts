/** URL base de l'API, configurable via variable d'entorn `NEXT_PUBLIC_API_URL`. */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/**
 * Mapa centralitzat de tots els endpoints de l'API.
 * Afegir aquí qualsevol endpoint nou per evitar URLs hardcodejades als serveis.
 */
export const ENDPOINTS = {
  auth: {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
  },
  game: {
    start: `${BASE_URL}/game/start`,
    active: `${BASE_URL}/game/me/active`,
    last: `${BASE_URL}/game/me/last`,
    updateStatus: (id: number) => `${BASE_URL}/game/${id}/status`,
    submitPuzzle: (id: number) => `${BASE_URL}/game/${id}/puzzle`,
  },
  room: {
    getById: (id: number) => `${BASE_URL}/room/${id}`,
  },
} as const;
