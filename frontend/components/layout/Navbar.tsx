"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PATHS } from "@/constants/paths";
import { useAuth } from "@/context/AuthContext";
import useActiveGame from "@/hooks/useActiveGame";

interface NavDropdownItem {
  label: string;
  href: string;
  disabled?: boolean;
}

interface NavRoute {
  label: string;
  href?: string;
  onClick?: () => void;
  dropdown?: NavDropdownItem[];
}

function formatRoomUrl(order: number): string {
  return String(order).padStart(2, "0");
}

const ALL_ROOMS = [
  { order: 1, label: "Sala 01" },
  { order: 2, label: "Sala 02" },
  { order: 3, label: "Sala 03" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, isAuthenticated } = useAuth();
  const { data: activeGameData } = useActiveGame();

  const activeGame =
    activeGameData?.game && activeGameData.game.status === "active"
      ? activeGameData.game
      : null;

  let routesToRender: NavRoute[] = [];

  if (pathname === PATHS.HOME && !isAuthenticated) {
    // Landing page
    routesToRender = [
      { label: "Entrar", href: PATHS.NARRATIVE },
      { label: "Registrar-se", href: PATHS.REGISTER },
    ];
  } else {
    routesToRender = [{ label: "Narrativa", href: PATHS.NARRATIVE }];

    if (activeGame) {
      const currentOrder = activeGame.currentRoom.order;
      const roomsDropdown: NavDropdownItem[] = ALL_ROOMS.map((r) => ({
        label: r.label,
        href: `${PATHS.ROOM}/${formatRoomUrl(r.order)}`,
        disabled: r.order > currentOrder,
      }));
      routesToRender.push({ label: "Sales", dropdown: roomsDropdown });
    }

    routesToRender.push(
      { label: "Instruccions", href: PATHS.INSTRUCCIONS },
      { label: "Perfil", href: PATHS.PROFILE },
      {
        label: "Logout",
        onClick: () => {
          logout();
          router.push(PATHS.HOME);
        },
      },
    );
  }

  return (
    <nav className="w-full max-w-7xl mx-auto flex justify-between items-center p-6 z-50">
      <div className="text-xl font-bold tracking-tighter text-cyan-400">
        ABYSS AI
      </div>
      <div className="flex gap-8 text-[10px] tracking-[0.3em] text-cyan-800 uppercase font-bold">
        {routesToRender.map((route) =>
          route.dropdown ? (
            <div key={route.label} className="relative group">
              <span className="cursor-pointer hover:text-cyan-400">
                {route.label}
              </span>
              {/* Wrapper amb padding-top perquè el gap entre el label i el menú
                  segueixi sent part del hover (evita que el popup es tanqui
                  en moure el cursor des de SALES cap al dropdown). */}
              <div className="absolute left-0 top-full hidden group-hover:block pt-2 z-50">
                <div className="flex flex-col bg-cyan-950 border border-cyan-500/30 p-2">
                  {route.dropdown.map((item) =>
                    item.disabled ? (
                      <span
                        key={item.href}
                        aria-disabled="true"
                        className="text-cyan-800/60 text-sm py-1 cursor-not-allowed line-through"
                      >
                        {item.label}
                      </span>
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-cyan-400 text-sm py-1 hover:text-cyan-200"
                      >
                        {item.label}
                      </Link>
                    ),
                  )}
                </div>
              </div>
            </div>
          ) : route.href ? (
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
            <button
              key={route.label}
              type="button"
              onClick={route.onClick}
              className="cursor-pointer hover:text-cyan-400 tracking-[0.3em] uppercase font-bold"
            >
              {route.label}
            </button>
          ),
        )}
      </div>
    </nav>
  );
}
