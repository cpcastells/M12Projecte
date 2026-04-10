"use client";

import Navbar from "@/components/layout/Navbar";
import { PATHS } from "@/constants/paths";
import { useAuth } from "@/context/AuthContext";
import { useGame } from "@/context/GameContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VictoryPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { activeGame, lastGame } = useGame();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(PATHS.LOGIN);
      return;
    }
    if (activeGame) {
      router.replace(`${PATHS.ROOM}/${activeGame.currentRoomId}`);
    }
  }, [isAuthenticated, activeGame, router]);

  const completedGame = lastGame?.status === "completed" ? lastGame : null;

  return (
    <main className="min-h-screen text-cyan-50 font-mono flex flex-col items-center selection:bg-cyan-950 overflow-hidden relative">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center text-center z-10 px-6 max-w-2xl">
        <div className="text-[10px] tracking-[0.6em] text-cyan-900 mb-8 flex items-center gap-4">
          <div className="h-px w-12 bg-cyan-900" />
          MISSIÓ COMPLETADA
          <div className="h-px w-12 bg-cyan-900" />
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-widest leading-none mb-4 text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">
          MISSIÓ
        </h1>
        <h1 className="text-5xl md:text-7xl font-black tracking-widest leading-none mb-8 drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          COMPLETADA
        </h1>

        <p className="text-cyan-600 text-sm tracking-[0.2em] mb-12 max-w-lg">
          Has aconseguit desactivar la quarantena i restaurar el contacte amb la
          superfície. L&apos;estació Hadal-7 està fora de perill.
        </p>

        {completedGame && (
          <div className="border border-cyan-800/40 p-6 mb-12 w-full max-w-sm">
            <div className="text-[10px] tracking-[0.3em] text-cyan-500 uppercase mb-4">
              Estadístiques
            </div>
            <div className="space-y-2 text-xs text-cyan-200">
              <div className="flex justify-between">
                <span>Data</span>
                <span className="text-cyan-400">
                  {new Date(completedGame.createdAt).toLocaleDateString("ca")}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={PATHS.PROFILE}
            className="px-12 py-4 border border-cyan-400 text-cyan-400 text-xs tracking-[0.4em] uppercase font-bold transition-all hover:bg-cyan-400 hover:text-black"
          >
            Veure Perfil
          </Link>
          <Link
            href={PATHS.HOME}
            className="px-12 py-4 border border-cyan-900/50 text-cyan-800 text-xs tracking-[0.4em] uppercase font-bold transition-all hover:border-cyan-600 hover:text-cyan-600"
          >
            Tornar a l&apos;inici
          </Link>
        </div>
      </div>
    </main>
  );
}
