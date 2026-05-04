"use client";

import { useEffect, useRef, useState } from "react";

export type FaceState = "idle" | "thinking" | "speaking" | "error";

type RobotFaceProps = {
  state: FaceState;
  size?: "sm" | "lg";
};

const SIZES = {
  sm: { w: 96, h: 96 },
  lg: { w: 220, h: 220 },
};

// ─────────────────────────────────────────────────────────────────────
// Mouth path per estat — totes les paths tenen el mateix nombre de
// punts perquè la transició entre estats sigui suau.
// Sistema de coords intern: 200×200, boca centrada al voltant de (100, 138).
// ─────────────────────────────────────────────────────────────────────
const mouthPath = (state: FaceState, openAmount = 0): string => {
  const cx = 100;
  const cy = 138;
  switch (state) {
    case "speaking": {
      // Oval que s'obre i tanca segons openAmount (0..1)
      const ry = 4 + openAmount * 9;
      const rx = 14 + openAmount * 2;
      return `M ${cx - rx} ${cy} Q ${cx} ${cy - ry} ${cx + rx} ${cy} Q ${cx} ${cy + ry} ${cx - rx} ${cy} Z`;
    }
    case "thinking":
      // Boca petita pensant ('o' lleuger)
      return `M ${cx - 6} ${cy} Q ${cx} ${cy - 3} ${cx + 6} ${cy} Q ${cx} ${cy + 3} ${cx - 6} ${cy} Z`;
    case "error":
      // Triste / invertida
      return `M ${cx - 14} ${cy + 4} Q ${cx} ${cy - 6} ${cx + 14} ${cy + 4} Q ${cx} ${cy + 2} ${cx - 14} ${cy + 4} Z`;
    case "idle":
    default:
      // Somriure suau
      return `M ${cx - 14} ${cy - 2} Q ${cx} ${cy + 8} ${cx + 14} ${cy - 2} Q ${cx} ${cy + 2} ${cx - 14} ${cy - 2} Z`;
  }
};

const colorByState = (state: FaceState) => {
  switch (state) {
    case "thinking":
      return { stroke: "#fbbf24", glow: "rgba(251,191,36,0.65)" };
    case "speaking":
      return { stroke: "#86efac", glow: "rgba(134,239,172,0.7)" };
    case "error":
      return { stroke: "#f87171", glow: "rgba(248,113,113,0.7)" };
    case "idle":
    default:
      return { stroke: "#22d3ee", glow: "rgba(34,211,238,0.55)" };
  }
};

const RobotFace = ({ state, size = "sm" }: RobotFaceProps) => {
  const dims = SIZES[size];
  const containerRef = useRef<HTMLDivElement>(null);

  // Pupil·les segueixen el cursor (offset relatiu al centre del cap)
  const [gaze, setGaze] = useState({ x: 0, y: 0 });

  // Parpelleig
  const [eyeOpen, setEyeOpen] = useState(true);

  // LED de l'antena
  const [ledOn, setLedOn] = useState(true);

  // "Boca parlant" — oscil·la quan està speaking
  const [mouthAmount, setMouthAmount] = useState(0);

  const colors = colorByState(state);

  // Cursor tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const max = 80;
      const dist = Math.hypot(dx, dy);
      const norm = dist > max ? max / dist : 1;
      // Limitem el moviment a un radi petit (en coords SVG 200×200)
      const k = 6;
      setGaze({ x: (dx * norm * k) / max, y: (dy * norm * k) / max });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Blink natural (algunes vegades doble)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const next = 2400 + Math.random() * 4200;
      timer = setTimeout(() => {
        setEyeOpen(false);
        setTimeout(() => {
          setEyeOpen(true);
          // doble blink ocasional
          if (Math.random() < 0.18) {
            setTimeout(() => {
              setEyeOpen(false);
              setTimeout(() => setEyeOpen(true), 110);
            }, 130);
          }
        }, 130);
        schedule();
      }, next);
    };
    schedule();
    return () => clearTimeout(timer);
  }, []);

  // LED parpelleig segons estat
  useEffect(() => {
    const interval =
      state === "thinking"
        ? 240
        : state === "speaking"
          ? 150
          : state === "error"
            ? 320
            : 1200;
    const id = setInterval(() => setLedOn((v) => !v), interval);
    return () => clearInterval(id);
  }, [state]);

  // Boca parlant: oscil·la amb soroll suau
  useEffect(() => {
    if (state !== "speaking") {
      setMouthAmount(0);
      return;
    }
    let raf = 0;
    let t = 0;
    const tick = () => {
      t += 0.18;
      // combinació de sinusoides per moviment "vocal"
      const v =
        0.5 +
        0.4 * Math.sin(t * 1.7) * Math.cos(t * 0.6) +
        0.1 * Math.sin(t * 4.1);
      setMouthAmount(Math.max(0, Math.min(1, v)));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state]);

  // Pupil·les que "vibren" lleugerament quan thinking
  const [thinkingJitter, setThinkingJitter] = useState(0);
  useEffect(() => {
    if (state !== "thinking") {
      setThinkingJitter(0);
      return;
    }
    let raf = 0;
    let t = 0;
    const tick = () => {
      t += 1;
      setThinkingJitter(Math.sin(t / 6) * 1.5);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state]);

  // Path de boca amb interpolació via CSS transition
  const path = mouthPath(state, mouthAmount);

  // Eye render helpers
  const eyeWhiteR = 14;
  const irisR = 7;
  const pupilR = 3.5;
  const leftEyeCx = 72;
  const rightEyeCx = 128;
  const eyesCy = 100;

  return (
    <div
      ref={containerRef}
      className="inline-block"
      style={{
        width: dims.w,
        height: dims.h,
        filter: `drop-shadow(0 0 6px ${colors.glow})`,
      }}
    >
      <svg viewBox="0 0 200 200" width={dims.w} height={dims.h} aria-hidden>
        <defs>
          <linearGradient id="head-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1f29" />
            <stop offset="100%" stopColor="#02080a" />
          </linearGradient>
          <radialGradient id="cheek-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors.stroke} stopOpacity="0.55" />
            <stop offset="100%" stopColor={colors.stroke} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="iris-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors.stroke} stopOpacity="1" />
            <stop offset="70%" stopColor={colors.stroke} stopOpacity="0.7" />
            <stop offset="100%" stopColor={colors.stroke} stopOpacity="0.2" />
          </radialGradient>
          <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        {/* Antena */}
        <line
          x1="100"
          y1="14"
          x2="100"
          y2="38"
          stroke={colors.stroke}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.85"
        />
        <circle
          cx="100"
          cy="10"
          r="5"
          fill={ledOn ? colors.stroke : "#0a1f29"}
          stroke={colors.stroke}
          strokeWidth="1.5"
          style={{ transition: "fill 120ms ease" }}
        />
        {ledOn && (
          <circle
            cx="100"
            cy="10"
            r="9"
            fill={colors.stroke}
            opacity="0.25"
            filter="url(#soft-glow)"
          />
        )}

        {/* Cap (arrodonit) */}
        <rect
          x="34"
          y="40"
          width="132"
          height="130"
          rx="34"
          ry="34"
          fill="url(#head-grad)"
          stroke={colors.stroke}
          strokeWidth="2"
          style={{ transition: "stroke 250ms ease" }}
        />

        {/* Plaques laterals (orelles) */}
        <rect
          x="22"
          y="80"
          width="14"
          height="44"
          rx="4"
          fill="#0a1f29"
          stroke={colors.stroke}
          strokeWidth="1.5"
        />
        <rect
          x="164"
          y="80"
          width="14"
          height="44"
          rx="4"
          fill="#0a1f29"
          stroke={colors.stroke}
          strokeWidth="1.5"
        />
        <line
          x1="26"
          y1="92"
          x2="32"
          y2="92"
          stroke={colors.stroke}
          strokeWidth="1"
          opacity="0.7"
        />
        <line
          x1="26"
          y1="100"
          x2="32"
          y2="100"
          stroke={colors.stroke}
          strokeWidth="1"
          opacity="0.7"
        />
        <line
          x1="26"
          y1="108"
          x2="32"
          y2="108"
          stroke={colors.stroke}
          strokeWidth="1"
          opacity="0.7"
        />
        <line
          x1="168"
          y1="92"
          x2="174"
          y2="92"
          stroke={colors.stroke}
          strokeWidth="1"
          opacity="0.7"
        />
        <line
          x1="168"
          y1="100"
          x2="174"
          y2="100"
          stroke={colors.stroke}
          strokeWidth="1"
          opacity="0.7"
        />
        <line
          x1="168"
          y1="108"
          x2="174"
          y2="108"
          stroke={colors.stroke}
          strokeWidth="1"
          opacity="0.7"
        />

        {/* Línia frontal divisòria */}
        <line
          x1="40"
          y1="58"
          x2="160"
          y2="58"
          stroke={colors.stroke}
          strokeWidth="0.8"
          opacity="0.4"
        />

        {/* Galtes glowing (només quan parla) */}
        {state === "speaking" && (
          <>
            <circle cx="58" cy="125" r="9" fill="url(#cheek-grad)" />
            <circle cx="142" cy="125" r="9" fill="url(#cheek-grad)" />
          </>
        )}

        {/* Cella esquerra */}
        <path
          d={
            state === "thinking" || state === "error"
              ? `M ${leftEyeCx - 14} 78 Q ${leftEyeCx} 70 ${leftEyeCx + 14} 84`
              : `M ${leftEyeCx - 14} 80 Q ${leftEyeCx} 76 ${leftEyeCx + 14} 80`
          }
          stroke={colors.stroke}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          style={{ transition: "d 250ms ease" }}
        />
        {/* Cella dreta */}
        <path
          d={
            state === "thinking" || state === "error"
              ? `M ${rightEyeCx - 14} 84 Q ${rightEyeCx} 70 ${rightEyeCx + 14} 78`
              : `M ${rightEyeCx - 14} 80 Q ${rightEyeCx} 76 ${rightEyeCx + 14} 80`
          }
          stroke={colors.stroke}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          style={{ transition: "d 250ms ease" }}
        />

        {/* Ulls — clip per la parpella */}
        {(["left", "right"] as const).map((side) => {
          const ex = side === "left" ? leftEyeCx : rightEyeCx;
          const clipId = `eye-clip-${side}`;
          return (
            <g key={side}>
              <defs>
                <clipPath id={clipId}>
                  <circle cx={ex} cy={eyesCy} r={eyeWhiteR} />
                </clipPath>
              </defs>
              {/* Globus ocular */}
              <circle
                cx={ex}
                cy={eyesCy}
                r={eyeWhiteR}
                fill="#02080a"
                stroke={colors.stroke}
                strokeWidth="1.5"
              />
              <g clipPath={`url(#${clipId})`}>
                {/* Iris */}
                <circle
                  cx={ex + gaze.x + thinkingJitter}
                  cy={eyesCy + gaze.y}
                  r={irisR}
                  fill="url(#iris-grad)"
                  style={{ transition: "cx 120ms ease-out, cy 120ms ease-out" }}
                />
                {/* Pupil·la */}
                <circle
                  cx={ex + gaze.x + thinkingJitter}
                  cy={eyesCy + gaze.y}
                  r={pupilR}
                  fill="#02080a"
                  style={{ transition: "cx 120ms ease-out, cy 120ms ease-out" }}
                />
                {/* Reflex */}
                <circle
                  cx={ex + gaze.x + thinkingJitter - 1.5}
                  cy={eyesCy + gaze.y - 1.5}
                  r={1.2}
                  fill="#e0fbff"
                  opacity="0.9"
                  style={{ transition: "cx 120ms ease-out, cy 120ms ease-out" }}
                />
                {/* Parpella superior */}
                <rect
                  x={ex - eyeWhiteR}
                  y={eyesCy - eyeWhiteR}
                  width={eyeWhiteR * 2}
                  height={eyeOpen ? 0 : eyeWhiteR * 2}
                  fill="#02080a"
                  style={{ transition: "height 90ms ease-in" }}
                />
                {/* Línia de la parpella tancada */}
                {!eyeOpen && (
                  <line
                    x1={ex - eyeWhiteR + 2}
                    y1={eyesCy}
                    x2={ex + eyeWhiteR - 2}
                    y2={eyesCy}
                    stroke={colors.stroke}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                )}
              </g>
              {/* Cèrcol exterior reforçat */}
              <circle
                cx={ex}
                cy={eyesCy}
                r={eyeWhiteR}
                fill="none"
                stroke={colors.stroke}
                strokeWidth="0.6"
                opacity="0.4"
              />
            </g>
          );
        })}

        {/* Boca */}
        <path
          d={path}
          fill="#02080a"
          stroke={colors.stroke}
          strokeWidth="2"
          strokeLinejoin="round"
          style={{ transition: "d 180ms ease, stroke 250ms ease" }}
        />

        {/* Punts de respiració/sensor sota la boca */}
        <circle cx="80" cy="158" r="1.4" fill={colors.stroke} opacity="0.55" />
        <circle cx="100" cy="160" r="1.4" fill={colors.stroke} opacity="0.7" />
        <circle cx="120" cy="158" r="1.4" fill={colors.stroke} opacity="0.55" />

        {/* Coll / connector inferior */}
        <rect
          x="78"
          y="170"
          width="44"
          height="10"
          rx="2"
          fill="#0a1f29"
          stroke={colors.stroke}
          strokeWidth="1.5"
        />
        <line
          x1="86"
          y1="175"
          x2="114"
          y2="175"
          stroke={colors.stroke}
          strokeWidth="0.8"
          opacity="0.6"
        />
      </svg>
    </div>
  );
};

export default RobotFace;
