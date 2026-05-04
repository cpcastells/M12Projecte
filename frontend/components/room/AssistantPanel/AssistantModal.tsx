"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import RobotFace from "@/components/room/AssistantPanel/RobotFace";
import Waveform from "@/components/room/AssistantPanel/Waveform";
import MatrixRain from "@/components/room/AssistantPanel/MatrixRain";
import useTypewriter from "@/components/room/AssistantPanel/useTypewriter";
import GlitchText from "@/components/effects/GlitchText/GlitchText";
import type {
  AssistantMessage,
  AssistantState,
} from "@/components/room/AssistantPanel/useAssistantState";
import type { Room } from "@/types/game";

type AssistantModalProps = {
  open: boolean;
  onClose: () => void;
  room: Room;
  state: AssistantState;
};

const ROLE_PREFIX: Record<AssistantMessage["role"], string> = {
  user: "USER>",
  ai: "ABYSS>",
  system: "!!>",
};

const ROLE_COLOR: Record<AssistantMessage["role"], string> = {
  user: "text-cyan-300",
  ai: "text-green-300",
  system: "text-amber-300",
};

const MessageRow = ({
  message,
  animate,
}: {
  message: AssistantMessage;
  animate: boolean;
}) => {
  const { display } = useTypewriter(animate ? message.text : "", 18);
  const text = animate ? display : message.text;
  const isAi = message.role === "ai";
  const showCursor = animate && display.length < message.text.length;
  return (
    <div className={`font-mono text-xs ${ROLE_COLOR[message.role]} mb-2`}>
      <span className="opacity-70 mr-2">{ROLE_PREFIX[message.role]}</span>
      <span className="whitespace-pre-wrap break-words">
        {isAi && !showCursor ? <GlitchText text={text} /> : text}
      </span>
      {showCursor && <span className="abyss-cursor">▌</span>}
    </div>
  );
};

const AssistantModal = ({
  open,
  onClose,
  room,
  state,
}: AssistantModalProps) => {
  const [input, setInput] = useState("");
  const [mounted, setMounted] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({
      top: logRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [state.messages.length, state.isPending]);

  if (!open || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.canAsk) return;
    state.sendQuestion(input);
    setInput("");
  };

  const lastAiIndex = (() => {
    for (let i = state.messages.length - 1; i >= 0; i -= 1) {
      if (state.messages[i].role === "ai") return i;
    }
    return -1;
  })();

  const inputDisabledReason = !state.aiEnabled
    ? "ASSISTENT DESACTIVAT"
    : state.aiHintsRemaining <= 0
      ? "QUOTA EXHAURIDA"
      : state.isPending
        ? "PROCESSANT..."
        : null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="ABYSS AI Terminal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm abyss-modal-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="abyss-crt relative w-[90vw] max-w-5xl h-[80vh] bg-[#02080a] border border-cyan-500/40 shadow-[0_0_60px_rgba(34,211,238,0.25)] flex overflow-hidden"
      >
        {/* Sidebar esquerre */}
        <aside className="w-64 border-r border-cyan-700/30 p-4 flex flex-col items-center gap-4 bg-[#031016]">
          <div className="text-[10px] uppercase tracking-widest text-cyan-500">
            ABYSS AI · v0.7
          </div>
          <div className="relative w-[220px] h-[220px] overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none opacity-80"
              style={{
                WebkitMaskImage:
                  "radial-gradient(circle at center, black 30%, transparent 75%)",
                maskImage:
                  "radial-gradient(circle at center, black 30%, transparent 75%)",
              }}
            >
              <MatrixRain state={state.faceState} />
            </div>
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <RobotFace state={state.faceState} size="lg" />
            </div>
          </div>
          <Waveform state={state.faceState} bars={80} />
          <div className="w-full text-[10px] text-cyan-700 font-mono space-y-1 border-t border-cyan-700/30 pt-3">
            <div className="flex justify-between">
              <span>STATUS</span>
              <span className="text-cyan-300">
                {state.faceState.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>SALA</span>
              <span className="text-cyan-300">{room.name}</span>
            </div>
            <div className="flex justify-between">
              <span>QUOTA</span>
              <span className="text-cyan-300">
                {state.aiHintsUsed}/{state.aiHintsMax}
              </span>
            </div>
            <div className="flex justify-between">
              <span>PRESSIÓ</span>
              <span>420 BAR</span>
            </div>
            <div className="flex justify-between">
              <span>FONDÀRIA</span>
              <span>−6,820 m</span>
            </div>
            <div className="flex justify-between">
              <span>CPU</span>
              <span>34%</span>
            </div>
          </div>
        </aside>

        {/* Àrea de chat */}
        <section className="flex-1 flex flex-col">
          <header className="flex items-center justify-between px-4 py-2 border-b border-cyan-700/30">
            <div className="font-mono text-xs text-cyan-400 tracking-widest">
              [ABYSS_AI://CHANNEL_OPEN]
            </div>
            <button
              type="button"
              aria-label="Tancar terminal"
              onClick={onClose}
              className="text-cyan-400 hover:text-red-400 font-mono text-sm px-2 transition"
            >
              ×
            </button>
          </header>

          <div
            ref={logRef}
            className="flex-1 overflow-y-auto p-4 font-mono text-xs"
          >
            {state.messages.length === 0 && (
              <div className="text-cyan-700 italic">
                {">> Canal obert. Formula la teva consulta. Cada interacció"}
                {" descompta puntuació."}
              </div>
            )}
            {state.messages.map((m, i) => (
              <MessageRow
                key={m.id}
                message={m}
                animate={i === lastAiIndex && m.role === "ai"}
              />
            ))}
            {state.isPending && (
              <div className="text-amber-400 font-mono text-xs">
                <span className="opacity-70 mr-2">ABYSS&gt;</span>
                <span className="abyss-cursor">▌</span> processant...
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-cyan-700/30 p-3 bg-[#020a0e]"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-cyan-400 text-xs">USER&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 300))}
                disabled={!state.canAsk}
                placeholder={
                  inputDisabledReason ?? "Escriu la teva consulta..."
                }
                maxLength={300}
                className="abyss-glitch flex-1 bg-transparent border-none outline-none font-mono text-xs text-cyan-100 placeholder:text-cyan-800 disabled:opacity-40"
              />
              <span className="font-mono text-[10px] text-cyan-700">
                {input.length}/300
              </span>
              <button
                type="submit"
                disabled={!state.canAsk || !input.trim()}
                className="border border-cyan-700 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-cyan-300 hover:border-cyan-400 hover:text-cyan-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                SEND
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>,
    document.body,
  );
};

export default AssistantModal;
