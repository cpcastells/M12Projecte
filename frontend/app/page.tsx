"use client";

import { useState, useEffect } from "react";

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  drift: number;
  speed: number;
}

// ─── Components Visuals ───────────────────────────────────────────────────────

const NoiseOverlay = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 opacity-[0.05] mix-blend-overlay"
      style={{ backgroundImage: `url('https://grainy-gradients.vercel.app')` }}
    />
  );
};

const FloatingDust = () => {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const initial = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2,
      opacity: Math.random() * 0.5,
      drift: (Math.random() - 0.5) * 0.02,
      speed: Math.random() * 0.01,
    }));
    setParticles(initial);
    const interval = setInterval(() => {
      setParticles((p) =>
        p.map((pt) => ({
          ...pt,
          y: pt.y - pt.speed > -2 ? pt.y - pt.speed : 102,
        })),
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bg-cyan-900 rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
};

// ─── Main Landing Page ────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#02080a] text-cyan-50 font-mono flex flex-col items-center selection:bg-cyan-950 overflow-hidden relative">
      <NoiseOverlay />
      <FloatingDust />

      {/* 1. Header / Navbar */}
      <nav className="w-full max-w-7xl flex justify-between items-center p-6 z-20">
        <div className="text-xl font-bold tracking-tighter text-cyan-400">
          ABYSS AI
        </div>
        <div className="flex gap-6 text-[10px] tracking-widest text-cyan-800 uppercase">
          <a
            href="#"
            className="hover:text-cyan-400 transition-colors border-b border-cyan-400 pb-1"
          >
            Inici
          </a>
          <a href="#" className="hover:text-cyan-400 transition-colors">
            Narrativa
          </a>
          <a href="#" className="hover:text-cyan-400 transition-colors">
            Instruccions
          </a>
          <a href="#" className="hover:text-cyan-400 transition-colors">
            Sala 01
          </a>
          <a href="#" className="hover:text-cyan-400 transition-colors">
            Perfil
          </a>
        </div>
      </nav>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center text-center z-10 px-6 max-w-4xl">
        {/* Localització superior */}
        <div className="text-[10px] tracking-[0.6em] text-cyan-900 mb-8 flex items-center gap-4">
          <div className="h-px w-12 bg-cyan-900" />
          PROFUNDITAT: 3.208 M — SECTOR ALFA
          <div className="h-px w-12 bg-cyan-900" />
        </div>

        {/* Títol Principal */}
        <div className="mb-8">
          <h1 className="text-7xl md:text-9xl font-black tracking-widest leading-none mb-2 drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            ABYSS
          </h1>
          <h1 className="text-7xl md:text-9xl font-black tracking-widest leading-none text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            AI
          </h1>
        </div>

        {/* Subtítol */}
        <h2 className="text-xs md:text-sm tracking-[0.4em] text-cyan-600 uppercase mb-12">
          Estació Submarina d&apos;Investigació Profunda
        </h2>

        {/* Text Narratiu */}
        <div className="space-y-6 text-cyan-800 text-[13px] leading-relaxed max-w-2xl font-light">
          <p>
            Any 2087. L&apos;estació Hadal-7 porta tres setmanes en silenci de
            ràdio. L&apos;última transmisió va mostrar{" "}
            <span className="text-cyan-400/60 font-bold tracking-widest italic">
              anomalies crítiques
            </span>{" "}
            als sistemes d&apos;IA. Tu ets l&apos;únic agent d&apos;evacuació
            que ha pogut accedir a la carcassa exterior.
          </p>
          <p>
            Navega pels compartiments,{" "}
            <span className="text-cyan-500">desactiva la quarantena</span> i
            descobreix per què l&apos;Abyss AI ha tallat el contacte amb la
            superfície.
          </p>
        </div>

        {/* Botons d'Acció */}
        <div className="mt-16 flex flex-col items-center gap-6 w-full">
          <button className="group relative px-20 py-4 border border-cyan-400 text-cyan-400 text-xs tracking-[0.4em] uppercase transition-all hover:bg-cyan-400 hover:text-black">
            <span className="relative z-10 font-bold">▶ Iniciar Missió</span>
          </button>

          <div className="flex gap-12 text-[9px] tracking-[0.3em] text-cyan-900 uppercase font-bold">
            <button className="hover:text-cyan-400 transition-colors">
              Instruccions
            </button>
            <button className="hover:text-cyan-400 transition-colors">
              El meu perfil
            </button>
          </div>
        </div>
      </div>

      {/* 3. Footer Stats */}
      <footer className="w-full max-w-5xl grid grid-cols-4 border-t border-cyan-900/30 p-10 z-10">
        <div className="text-center group border-r border-cyan-900/30">
          <div className="text-2xl font-bold text-cyan-50 mb-1">3</div>
          <div className="text-[8px] tracking-[0.3em] text-cyan-900 group-hover:text-cyan-600 transition-colors uppercase">
            Sales
          </div>
        </div>
        <div className="text-center group border-r border-cyan-900/30">
          <div className="text-2xl font-bold text-cyan-50 mb-1">7</div>
          <div className="text-[8px] tracking-[0.3em] text-cyan-900 group-hover:text-cyan-600 transition-colors uppercase">
            Enigmes
          </div>
        </div>
        <div className="text-center group border-r border-cyan-900/30">
          <div className="text-2xl font-bold text-cyan-400 mb-1">~45&apos;</div>
          <div className="text-[8px] tracking-[0.3em] text-cyan-900 group-hover:text-cyan-600 transition-colors uppercase">
            Durada Est.
          </div>
        </div>
        <div className="text-center group">
          <div className="text-2xl font-bold text-cyan-50 mb-1">∞</div>
          <div className="text-[8px] tracking-[0.3em] text-cyan-900 group-hover:text-cyan-600 transition-colors uppercase">
            Misteri
          </div>
        </div>
      </footer>
    </main>
  );
}
