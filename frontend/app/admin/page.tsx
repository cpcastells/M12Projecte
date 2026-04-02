"use client";
import Navbar from "@/components/layout/Navbar";

function AdminPage() {
  return (
    <main className="min-h-screen bg-[#010d16] text-cyan-50 font-mono flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="text-[10px] tracking-[0.6em] text-cyan-900 uppercase">
          Accés Restringit — Nivell Administrador
        </div>
        <h1 className="text-4xl font-black tracking-widest text-cyan-400">
          PANELL D&apos;ADMINISTRACIÓ
        </h1>
        <p className="text-xs text-cyan-800 tracking-widest uppercase mt-4">
          — Espai reservat per a futures gestions —
        </p>
      </div>
    </main>
  );
}
export default AdminPage;
