"use client";

import Navbar from "@/components/layout/Navbar";
import { GAME_CONSTANTS } from "@/constants/game";
import { PATHS } from "@/constants/paths";
import useLastGame from "@/hooks/useLastGame";
import useStartGame from "@/hooks/useStartGame";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

function formatRoomUrl(order: number): string {
  return String(order).padStart(2, "0");
}

function formatTime(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function GameOverPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useLastGame();
  const startGame = useStartGame();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const game = data?.game ?? null;
  const status = game?.status ?? null;
  const state = game?.state ?? null;

  const timeUsedSeconds = state
    ? Math.max(
        0,
        GAME_CONSTANTS.INITIAL_TIME_SECONDS - state.timeRemainingSeconds,
      )
    : 0;
  const score = state?.score ?? 0;

  const title =
    status === "completed"
      ? "MISSIÓ COMPLETADA"
      : status === "abandoned"
        ? "MISSIÓ FALLIDA"
        : "PARTIDA FINALITZADA";

  const subtitle =
    status === "abandoned"
      ? "Temps esgotat. L'Abyss AI ha segellat els compartiments."
      : status === "completed"
        ? "Has desactivat la quarantena i recuperat el contacte amb la superfície."
        : "";

  const handleNewMission = () => {
    if (startGame.isPending) return;
    setErrorMessage(null);
    startGame.mutate(undefined, {
      onSuccess: (response) => {
        queryClient.setQueryData(["activeGame"], response);
        queryClient.invalidateQueries({ queryKey: ["lastGame"] });
        const order = response.game.currentRoom.order;
        router.push(`${PATHS.ROOM}/${formatRoomUrl(order)}`);
      },
      onError: () => {
        setErrorMessage(
          "No s'ha pogut iniciar una nova missió. Torna-ho a intentar.",
        );
      },
    });
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#030d14] text-cyan-400 font-mono">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-6">
        {isLoading ? (
          <div className="animate-pulse tracking-widest text-sm">
            CARREGANT RESUM...
          </div>
        ) : !game ? (
          <div className="flex flex-col items-center gap-4 max-w-md text-center">
            <p className="text-sm text-cyan-600 tracking-widest">
              No s'ha trobat cap partida finalitzada.
            </p>
            <button
              onClick={handleNewMission}
              disabled={startGame.isPending}
              className="px-10 py-4 border border-cyan-400 text-cyan-400 text-xs tracking-[0.4em] uppercase hover:bg-cyan-400 hover:text-black transition disabled:opacity-50"
            >
              {startGame.isPending ? "▶ CREANT MISSIÓ..." : "▶ NOVA MISSIÓ"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8 max-w-xl text-center">
            <div className="text-[10px] tracking-[0.6em] text-cyan-800 uppercase">
              INFORME FINAL
            </div>
            <h1
              className={`text-4xl md:text-5xl font-black tracking-[0.3em] ${
                status === "completed" ? "text-green-400" : "text-red-400"
              }`}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-cyan-600 leading-relaxed max-w-md">
                {subtitle}
              </p>
            )}

            <dl className="grid grid-cols-2 gap-6 w-full max-w-md border-t border-b border-cyan-900/40 py-8">
              <div className="flex flex-col items-center">
                <dt className="text-[9px] tracking-[0.4em] text-cyan-800 uppercase mb-2">
                  Temps utilitzat
                </dt>
                <dd className="text-3xl font-black text-cyan-200">
                  {formatTime(timeUsedSeconds)}
                </dd>
              </div>
              <div className="flex flex-col items-center">
                <dt className="text-[9px] tracking-[0.4em] text-cyan-800 uppercase mb-2">
                  Puntuació
                </dt>
                <dd className="text-3xl font-black text-cyan-200">{score}</dd>
              </div>
            </dl>

            <div className="flex flex-col items-center gap-4 w-full">
              <button
                onClick={handleNewMission}
                disabled={startGame.isPending}
                className="px-14 py-4 border border-cyan-400 text-cyan-400 text-xs tracking-[0.4em] uppercase hover:bg-cyan-400 hover:text-black transition disabled:opacity-50 disabled:cursor-wait"
              >
                {startGame.isPending ? "▶ CREANT MISSIÓ..." : "▶ NOVA MISSIÓ"}
              </button>

              {errorMessage && (
                <p className="text-[10px] text-red-400 tracking-widest uppercase">
                  {errorMessage}
                </p>
              )}

              <button
                onClick={() => router.push(PATHS.HOME)}
                className="text-[9px] text-cyan-900 tracking-widest uppercase hover:text-cyan-400 transition"
              >
                ⇠ Tornar a inici
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
