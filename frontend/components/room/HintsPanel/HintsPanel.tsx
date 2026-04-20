"use client";

import { useState } from "react";
import useRequestHint from "@/hooks/useRequestHint";
import { useGameContext } from "@/context/GameContext";
import { AudioManager } from "@/utils/AudioManager";

type HintsPanelProps = {
  gameId: number;
  hintsUsed: number;
  maxHints: number;
};

const HintsPanel = ({ gameId, hintsUsed, maxHints }: HintsPanelProps) => {
  const [revealedHints, setRevealedHints] = useState<string[]>([]);
  const [currentHintsUsed, setCurrentHintsUsed] = useState(hintsUsed);
  const [infoMessage, setInfoMessage] = useState<string>("");
  const { mutate, isPending } = useRequestHint();
  const { save } = useGameContext();

  const hintsRemaining = maxHints - currentHintsUsed;
  const canRequestHint = hintsRemaining > 0;
  const hintLimitMessage =
    "Has arribat al límit de pistes. No es poden demanar més pistes per aquesta sala.";

  const handleRequestHint = () => {
    if (!canRequestHint) {
      setInfoMessage(hintLimitMessage);
      return;
    }

    if (isPending) return;

    setInfoMessage("");

    mutate(
      { gameId },
      {
        onSuccess: (data) => {
          setRevealedHints((prev) => [...prev, data.hint]);
          setCurrentHintsUsed(data.hintsUsed);

          if (data.hintsRemaining <= 0) {
            setInfoMessage(hintLimitMessage);
          }
          //Sonido d'alerta implementat solamnt per quan s'arriba al límit de pistes.
          AudioManager.play("alarm");
        },
        onError: (error) => {
          setInfoMessage(error.message ?? "No s'ha pogut demanar la pista.");
        },
        onSettled: () => {
          save();
        },
      },
    );
  };

  return (
    <div className="border-t border-cyan-700/30 pt-2">
      <div className="flex justify-between items-center mb-2">
        <div className="text-cyan-500 uppercase tracking-widest">Pistes</div>
        <div className="text-cyan-700 text-[10px]">
          {currentHintsUsed}/{maxHints}
        </div>
      </div>

      {revealedHints.length > 0 && (
        <div className="mb-2">
          {revealedHints.map((hint, i) => (
            <div
              key={i}
              className="bg-black text-green-400 font-mono text-xs p-2 mb-2 rounded border border-green-500/30"
            >
              [ABYSS AI LOG] {hint}
            </div>
          ))}
        </div>
      )}

      {infoMessage && (
        <div
          role="status"
          aria-live="polite"
          className="mb-2 rounded border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[10px] text-amber-100"
        >
          {infoMessage}
        </div>
      )}

      <button
        onClick={handleRequestHint}
        disabled={!canRequestHint || isPending}
        className="w-full border border-cyan-800 py-1.5 text-[10px] uppercase tracking-widest hover:border-cyan-400 hover:text-cyan-400 transition disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {isPending
          ? "CARREGANT..."
          : canRequestHint
            ? `DEMANAR PISTA (-100 pts)`
            : "SENSE PISTES"}
      </button>
    </div>
  );
};

export default HintsPanel;
