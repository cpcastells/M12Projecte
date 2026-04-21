"use client";

import { useState } from "react";
import useRequestHint from "@/hooks/useRequestHint";
import useActiveGame from "@/hooks/useActiveGame";
import { GAME_CONSTANTS } from "@/constants/game";
import { AudioManager } from "@/utils/AudioManager";

type HintsPanelProps = {
  gameId: number;
};

type Message =
  | { kind: "limit"; text: string }
  | { kind: "error"; text: string }
  | null;

const HINT_LIMIT_TEXT =
  "Has arribat al límit de pistes. No es poden demanar més pistes per aquesta sala.";

const HintsPanel = ({ gameId }: HintsPanelProps) => {
  const [revealedHints, setRevealedHints] = useState<string[]>([]);
  const [message, setMessage] = useState<Message>(null);
  const { mutate, isPending } = useRequestHint();
  const { data } = useActiveGame();

  const hintsUsed = data?.game.state?.hintsUsed ?? 0;
  const maxHints = GAME_CONSTANTS.MAX_HINTS;
  const hintsRemaining = maxHints - hintsUsed;
  const canRequestHint = hintsRemaining > 0;

  const handleRequestHint = () => {
    if (!canRequestHint) {
      setMessage({ kind: "limit", text: HINT_LIMIT_TEXT });
      return;
    }
    if (isPending) return;

    setMessage(null);

    mutate(
      { gameId },
      {
        onSuccess: (response) => {
          setRevealedHints((prev) => [...prev, response.hint]);
          if (response.hintsRemaining <= 0) {
            setMessage({ kind: "limit", text: HINT_LIMIT_TEXT });
            AudioManager.play("alarm");
          }
        },
        onError: (error) => {
          setMessage({
            kind: "error",
            text:
              error.message ??
              "No s'ha pogut demanar la pista. Torna-ho a intentar.",
          });
        },
      },
    );
  };

  return (
    <div className="border-t border-cyan-700/30 pt-2">
      <div className="flex justify-between items-center mb-2">
        <div className="text-cyan-500 uppercase tracking-widest">Pistes</div>
        <div className="text-cyan-700 text-[10px]">
          {hintsUsed}/{maxHints}
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

      {message?.kind === "limit" && (
        <div
          role="status"
          aria-live="polite"
          className="mb-2 rounded border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[10px] text-amber-100"
        >
          {message.text}
        </div>
      )}

      {message?.kind === "error" && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-2 rounded border border-red-500/50 bg-red-500/10 px-3 py-2 text-[10px] text-red-200"
        >
          {message.text}
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
            ? `DEMANAR PISTA (-${GAME_CONSTANTS.SCORE_HINT_PENALTY} pts)`
            : "SENSE PISTES"}
      </button>
    </div>
  );
};

export default HintsPanel;
