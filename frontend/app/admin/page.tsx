"use client";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

const SECTIONS = [
  {
    href: "/admin/users",
    label: "Usuaris",
    description: "Gestiona rols i elimina comptes",
    icon: "👥",
  },
  {
    href: "/admin/rooms",
    label: "Sales",
    description: "Consulta i edita les sales d'escapada",
    icon: "🚪",
  },
  {
    href: "/admin/puzzles",
    label: "Enigmes",
    description: "Revisa tots els puzzles registrats",
    icon: "🧩",
  },
];

function AdminPage() {
  return (
    <main className="min-h-screen bg-[#010d16] text-cyan-50 font-mono flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-10 px-4">
        <div className="text-center">
          <div className="text-[10px] tracking-[0.6em] text-cyan-900 uppercase mb-2">
            Accés Restringit — Nivell Administrador
          </div>
          <h1 className="text-4xl font-black tracking-widest text-cyan-400">
            PANELL D&apos;ADMINISTRACIÓ
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="border border-cyan-900 hover:border-cyan-500 bg-[#010d16] hover:bg-cyan-950/30 transition-all duration-200 rounded p-6 flex flex-col gap-2 group"
            >
              <span className="text-2xl">{s.icon}</span>
              <span className="text-cyan-400 font-bold tracking-widest uppercase text-sm group-hover:text-cyan-300">
                {s.label}
              </span>
              <span className="text-cyan-800 text-xs">{s.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export default AdminPage;
