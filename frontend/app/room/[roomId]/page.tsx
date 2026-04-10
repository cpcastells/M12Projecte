"use client";

import Navbar from "@/components/layout/Navbar";
import { PATHS } from "@/constants/paths";
import { useAuth } from "@/context/AuthContext";
import { useGame } from "@/context/GameContext";
import { getRoomById } from "@/services/room/roomService";
import { submitPuzzleAnswer } from "@/services/game/gameService";
import type { Room } from "@/types/room";
import type { GameState } from "@/types/game";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function RoomPage() {
  const { roomId } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { activeGame, refreshGame } = useGame();

  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // HUD state (queda local per sala, com s'ha decidit)
  const [time, setTime] = useState("16:07");
  const [oxygen, setOxygen] = useState(17);
  const [pressure, setPressure] = useState(420);
  const [energy, setEnergy] = useState(34);

  // Game state (restaurat del backend)
  const [attempts, setAttempts] = useState(0);
  const [clues, setClues] = useState<string[]>([]);

  const [enigmaInput, setEnigmaInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [doorUnlocked, setDoorUnlocked] = useState(false);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Guard de ruta
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(PATHS.LOGIN);
      return;
    }
    if (!activeGame) {
      router.replace(PATHS.HOME);
      return;
    }
    if (Number(roomId) !== activeGame.currentRoomId) {
      router.replace(`${PATHS.ROOM}/${activeGame.currentRoomId}`);
    }
  }, [isAuthenticated, activeGame, roomId, router]);

  // Carregar dades de la sala
  const loadRoom = useCallback(async () => {
    if (!activeGame || Number(roomId) !== activeGame.currentRoomId) return;

    setIsLoading(true);
    try {
      const { room: roomData } = await getRoomById(Number(roomId));
      setRoom(roomData);

      // Restaurar estat del joc
      const gameState = activeGame.state as GameState | null;
      if (gameState) {
        setAttempts(gameState.attempts ?? 0);
        setClues(gameState.cluesRevealed ?? []);
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeGame, roomId]);

  useEffect(() => {
    loadRoom();
  }, [loadRoom]);

  const showToast = (msg: string, duration = 2000) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), duration);
  };

  const verifyCode = async () => {
    if (!activeGame || !enigmaInput.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await submitPuzzleAnswer(activeGame.id, enigmaInput);

      if (result.correct) {
        setFeedback("correct");
        setDoorUnlocked(true);
        showToast("✓ Progrés desat", 3000);

        await refreshGame();

        setTimeout(() => {
          if (result.completed) {
            router.push("/game/victory");
          } else if (result.nextRoomId) {
            router.push(`${PATHS.ROOM}/${result.nextRoomId}`);
          }
        }, 1500);
      } else {
        setFeedback("wrong");
        const newAttempts = result.attempts ?? attempts + 1;
        setAttempts(newAttempts);
        setClues((prev) => [
          ...prev,
          `Intent ${newAttempts}: ${enigmaInput} → ✖ Incorrecte`,
        ]);
        setOxygen((prev) => Math.max(prev - 5, 0));
        setEnergy((prev) => Math.max(prev - 10, 0));
        setPressure((prev) => Math.max(prev - 20, 0));
        setTime((prev) => {
          const [hours, minutes] = prev.split(":").map(Number);
          const totalMinutes = hours * 60 + minutes + 2;
          const newHours = Math.floor(totalMinutes / 60) % 24;
          const newMinutes = totalMinutes % 60;
          return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
        });
      }
    } finally {
      setIsSubmitting(false);
      setEnigmaInput("");
    }
  };

  if (isLoading || !room) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#030d14] text-cyan-400">
        <div className="text-xs tracking-widest animate-pulse">
          CARREGANT SALA...
        </div>
      </main>
    );
  }

  // Generar descripcions dels objectes de la sala
  const objectDescriptions: Record<string, string> = {};
  for (const obj of room.objects) {
    objectDescriptions[obj.name.toLowerCase()] = obj.description;
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#030d14] text-cyan-400">
      <Navbar />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] flex-1">
        {/* Escena */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(0,50,80,0.3),transparent)]" />

          {/* ROOM SVG */}
          <svg
            className="absolute inset-0 w-full h-full opacity-80"
            viewBox="0 0 800 600"
          >
            <rect width="800" height="600" fill="#020a10" />
            {/* DOOR */}
            <rect
              x="330"
              y="180"
              width="140"
              height="280"
              fill={doorUnlocked ? "#022f1f" : "#050f16"}
              stroke={doorUnlocked ? "#00ff99" : "#00e5ff33"}
            />
            <text
              x="400"
              y="360"
              textAnchor="middle"
              fill={doorUnlocked ? "#00ff99" : "#ff3333"}
            >
              {doorUnlocked ? "DESBLOQUEJAT" : "BLOQUEJAT"}
            </text>

            {/* TERMINAL */}
            <rect
              x="60"
              y="100"
              width="180"
              height="300"
              fill="#071926"
              stroke="#00e5ff33"
            />
            <text x="150" y="120" textAnchor="middle" fill="#00e5ff">
              TERMINAL A
            </text>

            {/* PANEL */}
            <rect
              x="560"
              y="80"
              width="200"
              height="360"
              fill="#071926"
              stroke="#ffaa0033"
            />
            <text x="660" y="100" textAnchor="middle" fill="#ffaa00">
              PANEL
            </text>
          </svg>

          {/* OBJETOS INTERACTIVOS */}
          {[
            {
              id: "terminal",
              style: "left-[60px] top-[100px] w-[180px] h-[300px]",
            },
            {
              id: "panel",
              style: "left-[560px] top-[80px] w-[200px] h-[360px]",
            },
            {
              id: "door",
              style: "left-[330px] top-[180px] w-[140px] h-[280px]",
            },
          ].map((obj) => (
            <div
              key={obj.id}
              onClick={() => setSelectedObject(obj.id)}
              className={`absolute ${obj.style} cursor-pointer group`}
            >
              <div className="absolute inset-0 border border-transparent group-hover:border-cyan-400 transition" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-cyan-400 blur-xl transition" />
            </div>
          ))}

          {/* FEEDBACK VISUAL */}
          {doorUnlocked && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-green-400 text-sm tracking-widest animate-pulse">
              ✔ PORTA DESBLOQUEJADA
            </div>
          )}
        </div>

        {/* HUD PANEL */}
        <aside className="w-80 bg-[#040e15] border-l border-cyan-800/40 flex flex-col p-4 space-y-4 text-xs font-mono">
          {/* ESTADO */}
          <div>
            <div className="uppercase tracking-widest text-cyan-500">
              {room.name}
            </div>

            <div className="flex justify-between mt-1">
              <span>Temps</span>
              <span className="text-amber-400">{time}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                Intents <span>{attempts}</span>
              </div>
              <div>
                O₂ <span className="text-red-400">{oxygen}%</span>
              </div>
            </div>

            <div className="mt-3 h-0.75 bg-cyan-900">
              <div className="h-full bg-cyan-400 w-[12%]" />
            </div>
          </div>

          {/* INSPECCIÓN */}
          <div className="border-t border-cyan-700/30 pt-2">
            <div className="text-cyan-500 uppercase tracking-widest mb-2">
              Inspecció
            </div>
            <div className="text-cyan-200 text-[11px]">
              Panel de Control – SISTEMA CENTRAL
              <ul className="list-disc ml-4 mt-1">
                <li>Pressió: {pressure} bar</li>
                <li>Oxigen: {oxygen}%</li>
                <li>Energia: {energy}%</li>
              </ul>
            </div>
          </div>

          {/* OBJETO */}
          <div className="border-t border-cyan-700/30 pt-2">
            <div className="text-cyan-500 uppercase tracking-widest mb-2">
              Objecte
            </div>

            <div className="text-cyan-200 text-[11px] bg-black/30 p-2 border border-cyan-800 min-h-15">
              {selectedObject
                ? (objectDescriptions[selectedObject] ??
                  "Objecte sense descripció")
                : "Selecciona un objecte"}
            </div>
          </div>

          {/* PISTAS */}
          <div className="border-t border-cyan-700/30 pt-2">
            <div className="text-cyan-500 uppercase tracking-widest mb-2">
              Pistes
            </div>
            <ul className="list-disc ml-4 text-cyan-200">
              {clues.map((clue, i) => (
                <li key={i}>{clue}</li>
              ))}
            </ul>
          </div>

          {/* ENIGMA */}
          {room.puzzle && (
            <div className="border-t border-cyan-700/30 pt-2">
              <div className="text-cyan-500 uppercase tracking-widest mb-2">
                {room.puzzle.title}
              </div>
              <p className="text-cyan-200 text-[11px] mb-2">
                {room.puzzle.statement}
              </p>

              <input
                value={enigmaInput}
                onChange={(e) => setEnigmaInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && verifyCode()}
                className="w-full mb-2 px-3 py-2 bg-black border border-cyan-800 text-center tracking-widest focus:border-cyan-400 outline-none"
                placeholder="Resposta..."
                disabled={doorUnlocked || isSubmitting}
              />

              <button
                onClick={verifyCode}
                disabled={doorUnlocked || isSubmitting || !enigmaInput.trim()}
                className="w-full border border-cyan-400 py-2 hover:bg-cyan-400 hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "VERIFICANT..." : "▶ VERIFICAR"}
              </button>

              {feedback && (
                <div
                  className={`mt-2 text-xs px-2 py-1 border ${
                    feedback === "correct"
                      ? "text-green-400 border-green-400 bg-green-400/10"
                      : "text-red-400 border-red-400 bg-red-400/10"
                  }`}
                >
                  {feedback === "correct"
                    ? "✔ ACCÉS CONCEDIT"
                    : "✖ CODI INCORRECTE"}
                </div>
              )}
            </div>
          )}
        </aside>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-cyan-950 border border-cyan-400/30 text-cyan-400 text-xs tracking-widest animate-pulse">
          {toastMessage}
        </div>
      )}
    </main>
  );
}
