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
  { href: "/narrative", label: "Narrativa", protected: true },
  { href: "/room", label: "Salas", protected: true },
  { href: "/instruccions", label: "Instruccions", protected: true },
  { href: "/ajuda", label: "Ajuda", protected: true },
  { href: "/profile", label: "Perfil", protected: true },
  { href: "/admin", label: "Admin", adminOnly: true },
  { href: "/login", label: "Entrar" },
  { href: "/register", label: "Registrar-se" },
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
export const AUTH_ROUTES = ["/login", "/register"];
