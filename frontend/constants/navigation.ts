export interface NavRoute {
  href: string;
  label: string;
}

export const NAV_ROUTES: NavRoute[] = [
  { href: "/", label: "Inici" },
  { href: "/narrative", label: "Narrativa" },
  { href: "/room", label: "Salas" },
  { href: "/instruccions", label: "Instruccions" },
  { href: "/profile", label: "Perfil" },
  { href: "/login", label: "Entrar" },
];
