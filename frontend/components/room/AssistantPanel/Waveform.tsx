"use client";

import type { FaceState } from "@/components/room/AssistantPanel/RobotFace";

type WaveformProps = {
  state: FaceState;
  bars?: number;
};

// Barres de waveform per l'assistent IA
const Waveform = ({ state, bars = 48 }: WaveformProps) => {
  const isActive = state !== "idle";
  const colorClass =
    state === "thinking"
      ? "bg-amber-400"
      : state === "speaking"
        ? "bg-green-300"
        : "bg-cyan-400";

  return (
    <div
      aria-hidden
      className="flex items-center justify-between gap-px w-full h-14"
    >
      {Array.from({ length: bars }).map((_, i) => {
        // Envolupant ("formant") — emula la prosòdia d'una frase parlada:
        // pics i valls al llarg del temps, no aleatorietat plana.
        const t = i / bars;
        const formant =
          0.55 +
          0.45 *
            Math.sin(t * Math.PI * 3.2 + 0.7) *
            Math.sin(t * Math.PI * 1.4); // 0.1 – 1.0 aprox
        // Microvariació ràpida sobre l'envolupant (textura vocal)
        const micro = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1; // 0–1
        const envelope = Math.max(0.05, formant * (0.6 + 0.4 * micro));

        // Pic absolut
        const peak = isActive
          ? 25 + envelope * 75 // 25–100%
          : 8 + envelope * 18; // 8–26% (respiració mínima)

        // Cada barra s'anima a un ritme propi (simula fonemes diferents)
        const dur = isActive
          ? 0.18 + (i % 7) * 0.04 + (1 - envelope) * 0.15 // 0.18–0.6s
          : 1.1 + (i % 5) * 0.25; // 1.1–2.1s

        const delay = ((i * 37) % 100) * (isActive ? 4 : 18); // ms

        return (
          <span
            key={i}
            className={`flex-1 rounded-[0.5px] ${colorClass} abyss-bar`}
            style={{
              ["--bar-peak" as never]: `${peak}%`,
              ["--bar-min" as never]: `${peak * 0.18}%`,
              animationDuration: `${dur}s`,
              animationDelay: `${delay}ms`,
            }}
          />
        );
      })}
    </div>
  );
};

export default Waveform;
