/**
 * Rols disponibles dins l'aplicació.
 *
 * Tot i que a la base de dades el camp `role` és un string,
 * centralitzem aquí els valors per evitar errors tipogràfics
 * i facilitar el manteniment del codi.
 */
export const ROLES = {
  USER: "user",
  ADMIN: "admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
