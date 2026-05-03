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

  /** Endpoints de perfil */
  profile: {
    /** GET — Perfil + estadístiques agregades de l'usuari autenticat */
    me: `${BASE_URL}/profile/me`,
  },

  /** Endpoints del joc */
  game: {
    /** POST — Inicia o recupera la partida de l'usuari */
    start: `${BASE_URL}/game/start`,
    /** POST — Guarda el progrés de la partida */
    save: `${BASE_URL}/game/save`,
    /** GET — Retorna la partida activa de l'usuari */
    activeGame: `${BASE_URL}/game/me/active`,
    /** GET — Retorna l'última partida de l'usuari */
    lastGame: `${BASE_URL}/game/me/last`,
    /** POST — Envia la resposta d'un puzzle */
    answer: (gameId: number) => `${BASE_URL}/game/${gameId}/answer`,
    /** POST — Sol·licita una pista */
    hint: (gameId: number) => `${BASE_URL}/game/${gameId}/hint`,
    /** PATCH — Modifica camps controlats de la partida (status → ended; backend marca endReason=abandoned) */
    patch: (gameId: number) => `${BASE_URL}/game/${gameId}`,
    /** POST — Consulta l'assistent IA ABYSS (limitat per partida, penalitza score) */
    askAssistant: (gameId: number) =>
      `${BASE_URL}/game/${gameId}/ask-assistant`,
  },

  /** Endpoints d'administració  */
  admin: {
    /** GET — Llista tots els usuaris (amb _count games) */
    users: `${BASE_URL}/admin/users`,
    /** GET — Estadístiques detallades d'un jugador */
    userStats: (id: number) => `${BASE_URL}/admin/users/${id}/stats`,
    /** PATCH — Canvia el rol d'un usuari */
    userRole: (id: number) => `${BASE_URL}/admin/users/${id}/role`,
    /** DELETE — Elimina un usuari */
    deleteUser: (id: number) => `${BASE_URL}/admin/users/${id}`,
    /** GET — Llista totes les sales */
    rooms: `${BASE_URL}/admin/rooms`,
    /** PATCH — Actualitza nom/descripció d'una sala */
    updateRoom: (id: number) => `${BASE_URL}/admin/rooms/${id}`,
    /** GET — Llista tots els enigmes */
    puzzles: `${BASE_URL}/admin/puzzles`,
  },
} as const;
