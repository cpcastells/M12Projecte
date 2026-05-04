"use client";

import { useState } from "react";
import RobotFace from "@/components/room/AssistantPanel/RobotFace";
import Waveform from "@/components/room/AssistantPanel/Waveform";
import MatrixRain from "@/components/room/AssistantPanel/MatrixRain";
import AssistantModal from "@/components/room/AssistantPanel/AssistantModal";
import useAssistantState from "@/components/room/AssistantPanel/useAssistantState";
import GlitchText from "@/components/effects/GlitchText/GlitchText";
import useActiveGame from "@/hooks/useActiveGame";
import type { Room } from "@/types/game";

type AssistantPanelProps = {
  room: Room;
  gameId: number;
};

const AssistantPanel = ({ room, gameId }: AssistantPanelProps) => {
  const [open, setOpen] = useState(false);
  const { data } = useActiveGame();

  const aiHintsUsed = data?.game.state?.aiHintsUsed ?? 0;
  const aiEnabled = data?.game.aiEnabled !== false;

  const state = useAssistantState({ room, gameId, aiHintsUsed, aiEnabled });

  const quotaExhausted = state.aiHintsRemaining <= 0;
  const disabled = !aiEnabled;
  const statusLabel = disabled
    ? "OFFLINE"
    : state.faceState === "thinking"
      ? "PROCESSANT"
      : state.faceState === "speaking"
        ? "TRANSMETENT"
        : "ONLINE";

  const statusDot = disabled
    ? "bg-red-400"
    : state.faceState === "thinking"
      ? "bg-amber-400"
      : "bg-green-400";

  return (
    <>
      <div className="fixed z-40 top-20 right-[336px] w-72">
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={disabled}
          aria-label={
            disabled
              ? "Assistent ABYSS AI desactivat"
              : "Obrir terminal ABYSS AI"
          }
          className="abyss-crt group relative w-full text-left bg-[#02080a]/95 border border-cyan-500/40 hover:border-cyan-300 transition shadow-[0_0_25px_rgba(34,211,238,0.25)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-cyan-500/40 disabled:hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-cyan-700/40 bg-cyan-900/10">
            <div className="flex items-center gap-2">
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full ${statusDot} ${
                  !disabled ? "animate-pulse" : ""
                }`}
              />
              <span className="font-mono text-[10px] text-cyan-300 tracking-widest">
                ABYSS AI
              </span>
            </div>
            <span className="font-mono text-[9px] text-cyan-600 tracking-widest">
              {statusLabel}
            </span>
          </div>

          {/* MAIN: cara + waveform */}
          <div className="flex items-center gap-3 px-3 pt-3 pb-2">
            <div className="relative shrink-0 w-24 h-24 overflow-hidden">
              {/* Matrix rain darrere del robot */}
              <div
                className="absolute inset-0 pointer-events-none opacity-70"
                style={{
                  WebkitMaskImage:
                    "radial-gradient(circle at center, black 35%, transparent 80%)",
                  maskImage:
                    "radial-gradient(circle at center, black 35%, transparent 80%)",
                }}
              >
                <MatrixRain state={state.faceState} />
              </div>
              <div className="relative z-10">
                <RobotFace state={state.faceState} size="sm" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <Waveform state={state.faceState} bars={56} />
            </div>
          </div>

          {/* FRASE IDLE — sempre visible */}
          <div className="px-3 pb-2 min-h-[28px]">
            <div
              key={state.idlePhrase}
              className="abyss-phrase-in font-mono text-[10px] text-cyan-400/90 leading-tight line-clamp-2"
              title={state.idlePhrase}
            >
              <GlitchText text={state.idlePhrase || "—"} />
            </div>
          </div>

          {/* FOOTER: quota + CTA */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-cyan-700/40 bg-cyan-900/10">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] text-cyan-700 uppercase tracking-widest">
                Consultes
              </span>
              <span
                className={`font-mono text-[10px] ${
                  quotaExhausted ? "text-red-300" : "text-cyan-200"
                }`}
              >
                {state.aiHintsUsed}
                <span className="text-cyan-700">/{state.aiHintsMax}</span>
              </span>
            </div>
            <span
              className={`font-mono text-[10px] tracking-widest transition ${
                disabled
                  ? "text-cyan-700"
                  : quotaExhausted
                    ? "text-amber-300"
                    : "text-cyan-300 group-hover:text-cyan-100"
              }`}
            >
              {disabled
                ? "OFFLINE"
                : quotaExhausted
                  ? "VEURE LOG »"
                  : "ENGAGE »"}
            </span>
          </div>

          {/* Barra de progrés de quota */}
          <div className="h-0.5 bg-cyan-900/40">
            <div
              className={`h-full transition-all ${
                quotaExhausted ? "bg-red-400" : "bg-cyan-400"
              }`}
              style={{
                width: `${(state.aiHintsUsed / state.aiHintsMax) * 100}%`,
              }}
            />
          </div>
        </button>
      </div>

      <AssistantModal
        open={open}
        onClose={() => setOpen(false)}
        room={room}
        state={state}
      />
    </>
  );
};

export default AssistantPanel;
