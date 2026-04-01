"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface NavRoute {
  label: string;
  href?: string;
  onClick?: () => void;
  dropdown?: { label: string; href: string }[];
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  let routesToRender: NavRoute[] = [];

  if (pathname === "/") {
    // Landing page
    routesToRender = [
      { label: "Inici", href: "/" },
      { label: "Entrar", href: "/narrative" },
      { label: "Secció Extra", href: "/extra" },
    ];
  } else {
    // Páginas de narrativa / salas / instrucciones / perfil
    routesToRender = [
      { label: "Narrativa", href: "/narrative" },
      {
        label: "Salas",
        dropdown: [
          { label: "Sala 01", href: "/room/01" },
          { label: "Sala 02", href: "/room/02" },
          { label: "Sala 03", href: "/room/03" },
        ],
      },
      { label: "Instruccions", href: "/instruccions" },
      { label: "Perfil", href: "/profile" },
      { label: "Logout", onClick: () => router.push("/") },
    ];
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
              <div className="absolute hidden group-hover:flex flex-col bg-cyan-950 border border-cyan-500/30 mt-2 p-2 z-50">
                {route.dropdown.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href!}
                    className="text-cyan-400 text-sm py-1 hover:text-cyan-200"
                  >
                    {item.label}
                  </Link>
                ))}
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
            <span
              key={route.label}
              onClick={route.onClick}
<<<<<<< HEAD
              className={`cursor-pointer hover:text-cyan-400`}
=======
              className={`cursor-pointer ${
                pathname === route.href

            >
              {route.label}
            </span>
          ),
        )}
      </div>
    </nav>
  );
}
