import { PATHS } from "@/constants/paths";

export interface NavRoute {
  href: string;
  label: string;
  /** Si és true, la ruta requereix usuari autenticat */
  protected?: boolean;
  /** Si és true, la ruta requereix rol admin */
  adminOnly?: boolean;
}

/**
 * Rutes de navegació per a la barra de navegació.
 * Els flags `protected` i `adminOnly` s'usen per derivar
 * les llistes de rutes protegides del middleware.
 */
export const NAV_ROUTES: NavRoute[] = [
  { href: PATHS.NARRATIVE, label: "Narrativa", protected: true },
  { href: PATHS.ROOM, label: "Salas", protected: true },
  { href: PATHS.INSTRUCCIONS, label: "Instruccions", protected: true },
  { href: PATHS.AJUDA, label: "Ajuda", protected: true },
  { href: PATHS.PROFILE, label: "Perfil", protected: true },
  { href: PATHS.ADMIN, label: "Admin", adminOnly: true },
  { href: PATHS.LOGIN, label: "Entrar" },
  { href: PATHS.REGISTER, label: "Registrar-se" },
];

/** Rutes que requereixen usuari autenticat */
export const PROTECTED_ROUTES = NAV_ROUTES.filter((r) => r.protected).map(
  (r) => r.href,
);

/** Rutes que requereixen rol admin */
export const ADMIN_ROUTES = NAV_ROUTES.filter((r) => r.adminOnly).map(
  (r) => r.href,
);

/** Rutes d'autenticació: redirigeixen a / si ja hi ha sessió activa */
export const AUTH_ROUTES = [PATHS.LOGIN, PATHS.REGISTER];
