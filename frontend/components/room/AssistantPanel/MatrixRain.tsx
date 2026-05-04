"use client";

import { useEffect, useRef } from "react";
import type { FaceState } from "@/components/room/AssistantPanel/RobotFace";

type MatrixRainProps = {
  state: FaceState;
  className?: string;
};

const CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789▓▒░<>/\\|=+-*&%#@";

const colorByState = (state: FaceState): string => {
  switch (state) {
    case "thinking":
      return "251,191,36"; // amber
    case "speaking":
      return "134,239,172"; // green
    case "error":
      return "248,113,113"; // red
    case "idle":
    default:
      return "34,211,238"; // cyan
  }
};

const MatrixRain = ({ state, className }: MatrixRainProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const fontSize = 13;
    let cols = 0;
    let rows = 0;
    let drops: number[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(rect.width / fontSize);
      rows = Math.ceil(rect.height / fontSize);
      drops = Array.from({ length: cols }, () => Math.random() * rows * -1);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    let raf = 0;
    let lastTime = 0;

    const draw = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;

      // Velocitat segons estat (frames per "step")
      const s = stateRef.current;
      const stepInterval =
        s === "thinking" ? 55 : s === "speaking" ? 35 : s === "error" ? 70 : 90;

      const rect = canvas.getBoundingClientRect();
      const rgb = colorByState(s);

      // Fade del canvas (cua dels caràcters)
      ctx.fillStyle = "rgba(2, 8, 10, 0.18)";
      ctx.fillRect(0, 0, rect.width, rect.height);

      ctx.font = `${fontSize}px "Geist Mono", ui-monospace, monospace`;

      for (let i = 0; i < drops.length; i += 1) {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Cap de la columna (brillant)
        ctx.fillStyle = `rgba(${rgb}, 1)`;
        ctx.shadowColor = `rgba(${rgb}, 0.9)`;
        ctx.shadowBlur = 8;
        ctx.fillText(ch, x, y);

        // Cua (caràcter anterior més fosc)
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(${rgb}, 0.45)`;
        if (y - fontSize > 0) {
          const prev = CHARS[Math.floor(Math.random() * CHARS.length)];
          ctx.fillText(prev, x, y - fontSize);
        }

        // Avanç (per dt) — controlat amb stepInterval ms per fila
        drops[i] += dt / stepInterval;

        // Reset quan surt per baix
        if (drops[i] * fontSize > rect.height && Math.random() > 0.975) {
          drops[i] = -Math.random() * 5;
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
};

export default MatrixRain;
