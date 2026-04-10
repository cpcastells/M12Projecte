"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import GlitchText from "@/components/effects/GlitchText/GlitchText";
import { LANDING_COPY } from "@/constants/copy/landing";
import { PATHS } from "@/constants/paths";
import { useAuth } from "@/context/AuthContext";
import { useGame } from "@/context/GameContext";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { activeGame, lastGame, startGame, abandonGame, isLoadingGame } =
    useGame();
  const [showAbandonModal, setShowAbandonModal] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const handleStartGame = async () => {
    setIsStarting(true);
    try {
      await startGame();
      router.push(PATHS.NARRATIVE);
    } finally {
      setIsStarting(false);
    }
  };

  const handleAbandonAndStart = async () => {
    setIsStarting(true);
    try {
      await abandonGame();
      await startGame();
      setShowAbandonModal(false);
      router.push(PATHS.NARRATIVE);
    } finally {
      setIsStarting(false);
    }
  };

  const isCompleted = !activeGame && lastGame?.status === "completed";

  return (
    <main className="min-h-screen text-cyan-50 font-mono flex flex-col items-center selection:bg-cyan-950 overflow-hidden relative">
      <Navbar />

      {/* Contingut principal */}
      <div className="flex-1 flex flex-col items-center justify-center text-center z-10 px-6 max-w-4xl">
        {/* Localització superior */}
        <div className="text-[10px] tracking-[0.6em] text-cyan-900 mb-8 flex items-center gap-4">
          <div className="h-px w-12 bg-cyan-900" />
          {LANDING_COPY.location}
          <div className="h-px w-12 bg-cyan-900" />
        </div>

        {/* Títol principal */}
        <div className="mb-8">
          <h1 className="text-7xl md:text-9xl font-black tracking-widest leading-none mb-2 drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            {LANDING_COPY.title}
          </h1>
          <h1 className="text-7xl md:text-9xl font-black tracking-widest leading-none text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            {LANDING_COPY.titleAccent}
          </h1>
        </div>

        {/* Subtítol */}
        <h2 className="text-xs md:text-sm tracking-[0.4em] text-cyan-600 uppercase mb-12">
          {LANDING_COPY.subtitle}
        </h2>

        {/* Text narratiu */}
        <div className="space-y-6 text-cyan-800 text-[13px] leading-relaxed max-w-2xl font-light">
          {LANDING_COPY.narrative.map((p, i) => (
            <p key={i}>
              {p.before}
              <span
                className={
                  i === 0
                    ? "text-cyan-400/60 font-bold tracking-widest italic"
                    : "text-cyan-500"
                }
              >
                {p.highlight}
              </span>
              {p.after}
            </p>
          ))}
        </div>

        {/* Botons d'acció */}
        <div className="mt-16 flex flex-col items-center gap-6 w-full">
          {!isAuthenticated ? (
            <div className="flex flex-col items-center gap-4">
              <GlitchText
                text={LANDING_COPY.ctaLoginHint}
                className="text-[10px] tracking-[0.3em] text-cyan-600 uppercase"
              />
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <a
                  href="/register"
                  className="px-16 py-4 border border-cyan-400 bg-cyan-400 text-black text-xs tracking-[0.4em] uppercase font-bold transition-all hover:bg-cyan-300"
                >
                  ▶ {LANDING_COPY.ctaRegister}
                </a>
                <a
                  href="/login"
                  className="px-16 py-4 border border-cyan-400/50 text-cyan-600 text-xs tracking-[0.4em] uppercase font-bold transition-all hover:border-cyan-400 hover:text-cyan-400"
                >
                  {LANDING_COPY.ctaLogin}
                </a>
              </div>
            </div>
          ) : activeGame ? (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() =>
                  router.push(`${PATHS.ROOM}/${activeGame.currentRoomId}`)
                }
                className="group relative px-20 py-4 border border-cyan-400 text-cyan-400 text-xs tracking-[0.4em] uppercase transition-all hover:bg-cyan-400 hover:text-black cursor-pointer"
              >
                <span className="relative z-10 font-bold">
                  ▶ Continuar Missió
                </span>
              </button>
              <button
                onClick={() => setShowAbandonModal(true)}
                className="px-12 py-3 border border-cyan-900/50 text-cyan-800 text-[10px] tracking-[0.3em] uppercase transition-all hover:border-cyan-600 hover:text-cyan-600 cursor-pointer"
              >
                Nova Partida
              </button>
            </div>
          ) : isCompleted ? (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleStartGame}
                disabled={isStarting}
                className="group relative px-20 py-4 border border-cyan-400 text-cyan-400 text-xs tracking-[0.4em] uppercase transition-all hover:bg-cyan-400 hover:text-black cursor-pointer disabled:opacity-50"
              >
                <span className="relative z-10 font-bold">▶ Nova Partida</span>
              </button>
              <button
                onClick={() => router.push(PATHS.PROFILE)}
                className="px-12 py-3 border border-cyan-900/50 text-cyan-800 text-[10px] tracking-[0.3em] uppercase transition-all hover:border-cyan-600 hover:text-cyan-600 cursor-pointer"
              >
                Veure Estadístiques
              </button>
            </div>
          ) : (
            <button
              onClick={handleStartGame}
              disabled={isStarting || isLoadingGame}
              className="group relative px-20 py-4 border border-cyan-400 text-cyan-400 text-xs tracking-[0.4em] uppercase transition-all hover:bg-cyan-400 hover:text-black cursor-pointer disabled:opacity-50"
            >
              <span className="relative z-10 font-bold">
                ▶ {LANDING_COPY.ctaPrimary}
              </span>
            </button>
          )}
        </div>

        {/* Modal d'abandonament */}
        {showAbandonModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="border border-cyan-400/30 bg-abyss-bg p-8 max-w-md text-center">
              <p className="text-cyan-400 text-xs tracking-[0.3em] uppercase mb-2">
                ⚠ Partida en curs
              </p>
              <p className="text-cyan-600 text-sm mb-8">
                Tens una partida activa a la Sala {activeGame?.currentRoom.code}
                . Si en comences una de nova, la perdràs.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowAbandonModal(false)}
                  className="px-8 py-3 border border-cyan-400/50 text-cyan-400 text-[10px] tracking-[0.3em] uppercase hover:bg-cyan-400/10 cursor-pointer"
                >
                  Continuar l&apos;actual
                </button>
                <button
                  onClick={handleAbandonAndStart}
                  disabled={isStarting}
                  className="px-8 py-3 border border-red-500/50 text-red-400 text-[10px] tracking-[0.3em] uppercase hover:bg-red-500/10 cursor-pointer disabled:opacity-50"
                >
                  Abandonar i nova
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Footer stats */}
      <footer className="w-full max-w-5xl grid grid-cols-4 border-t border-cyan-900/30 p-10 z-10">
        {LANDING_COPY.stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`text-center group ${i < LANDING_COPY.stats.length - 1 ? "border-r border-cyan-900/30" : ""}`}
          >
            <div
              className={`text-2xl font-bold mb-1 ${stat.accent ? "text-cyan-400" : "text-cyan-50"}`}
            >
              {stat.value}
            </div>
            <div className="text-[8px] tracking-[0.3em] text-cyan-900 group-hover:text-cyan-600 transition-colors uppercase">
              {stat.label}
            </div>
          </div>
        ))}
      </footer>
    </main>
  );
}
