"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useGameTimer from "@/hooks/useGameTimer";
import { PATHS } from "@/constants/paths";
import { AudioManager } from "@/utils/AudioManager";

/**
 * Quan el timer expira:
 * - el backend ja marca la partida com finalitzada amb endReason timeExpired;
 * - mostra un overlay d'alarma amb compte enrere (5→1);
 * - al final del compte enrere, força el redirect a /game-over.
 */
type TimeExpiredGuardProps = {
  gameId: number;
};

const COUNTDOWN_FROM_SECONDS = 5;

const TimeExpiredGuard = ({ gameId }: TimeExpiredGuardProps) => {
  const { isExpired } = useGameTimer(gameId);
  const router = useRouter();
  const triggeredRef = useRef(false);
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_FROM_SECONDS);

  useEffect(() => {
    if (!isExpired || triggeredRef.current) return;
    triggeredRef.current = true;
    AudioManager.play("alarm");
  }, [isExpired]);

  useEffect(() => {
    if (!isExpired || secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [isExpired, secondsLeft]);

  useEffect(() => {
    if (!isExpired || secondsLeft > 0) return;
    router.replace(PATHS.GAME_OVER);
  }, [isExpired, secondsLeft, router]);

  if (!isExpired) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
    >
      <div className="relative flex flex-col items-center gap-6 border border-red-500 bg-red-500/5 px-20 py-14 shadow-[0_0_60px_rgba(239,68,68,0.35)]">
        <div className="absolute -top-px left-0 h-px w-full bg-red-500 animate-pulse" />
        <div className="absolute -bottom-px left-0 h-px w-full bg-red-500 animate-pulse" />

        <div className="text-[10px] tracking-[0.6em] text-red-500/80 uppercase">
          SISTEMA // ALERTA CRÍTICA
        </div>

        <div className="text-4xl font-black tracking-[0.3em] text-red-400">
          TEMPS ESGOTAT
        </div>

        <div className="text-[10px] tracking-[0.4em] text-red-500 uppercase max-w-md text-center leading-relaxed">
          L'Abyss AI ha segellat els compartiments. Registrant l'incident a
          l'informe final en
        </div>

        <div
          key={secondsLeft}
          aria-label={`${secondsLeft} segons restants`}
          className="text-8xl font-black text-red-400 leading-none drop-shadow-[0_0_30px_rgba(239,68,68,0.6)] animate-[timeExpiredCountdown_1s_ease-out_forwards]"
        >
          {Math.max(0, secondsLeft)}
        </div>
      </div>
      <style>{`
        @keyframes timeExpiredCountdown {
          0%   { transform: scale(1.4); opacity: 0.15; }
          40%  { transform: scale(1);   opacity: 1;    }
          100% { transform: scale(0.92); opacity: 0.75; }
        }
      `}</style>
    </div>
  );
};

export default TimeExpiredGuard;
