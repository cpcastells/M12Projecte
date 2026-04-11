import { authorizeRoles } from "./authorizeRoles";
import { ROLES } from "../constants/roles";

/**
 * Middleware específic d'administració.
 * Equivalent a authorizeRoles(ROLES.ADMIN)
 */
export const requireAdmin = authorizeRoles(ROLES.ADMIN);
