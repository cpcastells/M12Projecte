/**
 * Prisma includes centralitzats per a Room (seguretat i shape).
 *
 * Objectiu:
 * - Garantir que mai es filtran camps sensibles (ex: puzzle.solution)
 * - Evitar includes duplicats o incoherents als repositories.
 */

/**
 * SAFE- Per controllers i responses al client.
 * Mai inclou camps sensibles.
 */
export const roomIncludeForResponse = {
  objects: true,
  puzzle: {
    select: {
      id: true,
      roomId: true,
      title: true,
      statement: true,
      reward: true,
    },
  },
} as const;

/**
 * BACKEND ONLY- Exclusiu per a repositories i use cases.
 *
 * - Inclou camps sensibles necessaris per a validacions (ex: puzzle.solution).
 * - MAI s'ha d'utilitzar directament en controllers.
 */
export const roomIncludeForValidation = {
  puzzle: true,
} as const;
