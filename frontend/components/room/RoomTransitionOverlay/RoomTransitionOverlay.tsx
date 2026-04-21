"use client";

import { useEffect, useState } from "react";

/**
 * Overlay de transició entre sales. Es mostra després d'una resposta correcta
 * per confirmar l'accés i donar al jugador un compte enrere visual abans que
 * el router redirigeixi a la sala següent.
 *
 * Purament presentacional: la lògica de retardar la navegació viu al
 * consumidor (PuzzlePanel). L'overlay expira sol; quan el consumidor aplica
 * la nova cache, `useRoom` redirigeix i aquest component es desmunta.
 */
type RoomTransitionOverlayProps = {
  /** Nombre inicial del compte enrere en segons. Ha de coincidir amb el timeout del consumidor. */
  countdownFromSeconds: number;
  message?: string;
};

const RoomTransitionOverlay = ({
  countdownFromSeconds,
  message = "ACCÉS CONCEDIT",
}: RoomTransitionOverlayProps) => {
  const [secondsLeft, setSecondsLeft] = useState(countdownFromSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
    >
      <div className="relative flex flex-col items-center gap-6 border border-green-400 bg-green-400/5 px-20 py-14 shadow-[0_0_60px_rgba(34,197,94,0.35)]">
        <div className="absolute -top-px left-0 h-px w-full bg-green-400 animate-pulse" />
        <div className="absolute -bottom-px left-0 h-px w-full bg-green-400 animate-pulse" />

        <div className="text-[10px] tracking-[0.6em] text-green-500/70 uppercase">
          SISTEMA
        </div>

        <div className="text-4xl font-black tracking-[0.3em] text-green-400">
          {message}
        </div>

        <div className="text-[10px] tracking-[0.4em] text-green-600 uppercase">
          Obrint següent sala en
        </div>

        <div
          key={secondsLeft}
          aria-label={`${secondsLeft} segons restants`}
          className="text-8xl font-black text-green-400 leading-none drop-shadow-[0_0_30px_rgba(34,197,94,0.6)] animate-[transitionCountdown_1s_ease-out_forwards]"
        >
          {Math.max(0, secondsLeft)}
        </div>
      </div>
      <style>{`
        @keyframes transitionCountdown {
          0%   { transform: scale(1.4); opacity: 0.2; }
          40%  { transform: scale(1);   opacity: 1;   }
          100% { transform: scale(0.9); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default RoomTransitionOverlay;
