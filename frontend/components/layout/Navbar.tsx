"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PATHS } from "@/constants/paths";
import { useAuth } from "@/context/AuthContext";
import { useGame } from "@/context/GameContext";

interface NavRoute {
  label: string;
  href?: string;
  onClick?: () => void;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, isAuthenticated } = useAuth();
  const { activeGame } = useGame();

  let routesToRender: NavRoute[] = [];

  if (!isAuthenticated) {
    routesToRender = [
      { label: "Entrar", href: PATHS.LOGIN },
      { label: "Registrar-se", href: PATHS.REGISTER },
    ];
  } else if (activeGame) {
    // Partida activa: Narrativa, Instruccions, Sala actual, Perfil, Logout
    routesToRender = [
      { label: "Narrativa", href: PATHS.NARRATIVE },
      { label: "Instruccions", href: PATHS.INSTRUCCIONS },
      {
        label: `Sala ${activeGame.currentRoom.code}`,
        href: `${PATHS.ROOM}/${activeGame.currentRoomId}`,
      },
      { label: "Perfil", href: PATHS.PROFILE },
      {
        label: "Logout",
        onClick: () => {
          logout();
          router.push(PATHS.HOME);
        },
      },
    ];
  } else {
    // Autenticat sense partida activa
    routesToRender = [
      { label: "Perfil", href: PATHS.PROFILE },

      {
        label: "Logout",
        onClick: () => {
          logout();
          router.push(PATHS.HOME);
        },
      },
    ];
  }

  return (
    <nav className="w-full max-w-7xl mx-auto flex justify-between items-center p-6 z-50">
      <Link
        href={PATHS.HOME}
        className="text-xl font-bold tracking-tighter text-cyan-400"
      >
        ABYSS AI
      </Link>
      <div className="flex gap-8 text-[10px] tracking-[0.3em] text-cyan-800 uppercase font-bold">
        {routesToRender.map((route) =>
          route.href ? (
            <Link
              key={route.label}
              href={route.href}
              className={`cursor-pointer ${
                pathname === route.href
                  ? "text-cyan-400 border-b border-cyan-400 pb-1"
                  : "hover:text-cyan-400"
              }`}
            >
              {route.label}
            </Link>
          ) : (
            <span
              key={route.label}
              onClick={route.onClick}
              className="cursor-pointer hover:text-cyan-400"
            >
              {route.label}
            </span>
          ),
        )}
      </div>
    </nav>
  );
}
