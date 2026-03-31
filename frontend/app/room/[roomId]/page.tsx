"use client";

import Navbar from "@/components/layout/Navbar";
import { useParams } from "next/navigation";
import { useState } from "react";


export default function RoomPage() {
  const { roomId } = useParams();  // Objectes clicables de la sala

  // Estado general
  const [time, setTime] = useState("16:07");
  const [attempts, setAttempts] = useState(3);
  const [oxygen, setOxygen] = useState(17);
  const [pressure, setPressure] = useState(420);
  const [energy, setEnergy] = useState(34);
  const [clues, setClues] = useState(["El codi té 4 dígits", "La profunditat de l'estació és 4.200 metres"]);
  const [enigmaInput, setEnigmaInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const verifyCode = () => {
    if (enigmaInput === "4200") { // Ejemplo de código correcto
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
    setEnigmaInput("");
    setAttempts(prev => prev + 1);
    setOxygen(prev => Math.max(prev - 5, 0)); // Penalización de oxígeno por intento
    setTime(prev => {
      const [hours, minutes] = prev.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes + 2; // Añadir 2 minutos por intento
      const newHours = Math.floor(totalMinutes / 60) % 24;
      const newMinutes = totalMinutes % 60;
      return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
    });
    setClues(prev => [...prev, `Intent ${attempts + 1}: Codi ${enigmaInput} - ${enigmaInput === "4200" ? "Correcte" : "Incorrecte"}`]);
    setEnergy(prev => Math.max(prev - 10, 0)); // Penalización de energía por intento
    setPressure(prev => Math.max(prev - 20, 0)); // Penalización de presión por intento
  };


   return (
    <main className="min-h-screen flex flex-col bg-[#030d14] text-cyan-400">
      <Navbar />

      <div className="flex flex-1">
        {/* Area principal de la sala */}
        <div className="flex-1 relative bg-[#030d14] p-6">
          {/* Objetos interactivos */}
          <div className="absolute top-32 left-32 w-20 h-20 bg-[#001f33] border border-cyan-500 flex items-center justify-center cursor-pointer">
            <span>Terminal 1</span>
          </div>
          <div className="absolute top-48 left-64 w-20 h-20 bg-[#330000] border border-red-500 flex items-center justify-center cursor-not-allowed">
            <span>Bloquejat</span>
          </div>
        </div>

        {/* Panel derecho tipo HUD */}
        <aside className="w-80 bg-[#040e15] border-l border-cyan-800/40 flex flex-col p-4 space-y-4 text-xs font-mono">
          {/* Estado de la misión */}
          <div>
            <div className="uppercase tracking-widest text-cyan-500">Sala {roomId}/03</div>
            <div className="flex justify-between mt-1">
              <span>Temps</span>
              <span className="text-amber-400">{time}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Intents</span>
              <span>{attempts}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>O₂</span>
              <span className="text-red-500">{oxygen}%</span>
            </div>
          </div>

          {/* Panel de inspección */}
          <div className="border-t border-cyan-700/30 pt-2">
            <div className="text-cyan-500 uppercase tracking-widest mb-2">Inspecció</div>
            <div className="text-cyan-200 text-[11px]">
              Panel de Control – SISTEMA CENTRAL
              <ul className="list-disc ml-4 mt-1">
                <li>Pressió: {pressure} bar (nominal)</li>
                <li>Oxigen: {oxygen}% (CRITIC)</li>
                <li>Energia: {energy}%</li>
              </ul>
              Hi ha 4 interruptors actius. Display espera 4 dígits.
            </div>
          </div>

          {/* Pistas recogidas */}
          <div className="border-t border-cyan-700/30 pt-2">
            <div className="text-cyan-500 uppercase tracking-widest mb-2">Pistes recollides</div>
            <ul className="list-disc ml-4 text-cyan-200">
              {clues.map((clue, i) => <li key={i}>{clue}</li>)}
            </ul>
          </div>

          {/* Enigma activo */}
          <div className="border-t border-cyan-700/30 pt-2">
            <div className="text-cyan-500 uppercase tracking-widest mb-2">Enigma de sala</div>
            <div className="text-cyan-200 text-[11px] mb-2">
              La nota diu: &quot;La clau és la profunditat en dígits&quot;. Quin és el codi d&apos;accés de 4 dígits?
            </div>
            <input
              type="text"
              value={enigmaInput}
              onChange={(e) => setEnigmaInput(e.target.value)}
              className="w-full bg-[#001f33] border border-cyan-500 px-2 py-1 text-cyan-400 text-sm mb-1 focus:outline-none"
              placeholder="0000"
            />
            <button
              onClick={verifyCode}
              className="w-full bg-[#00ffff20] border border-cyan-400 text-cyan-400 text-xs py-1 uppercase hover:bg-[#00ffff30] transition"
            >
              Verificar codi
            </button>
            {feedback && (
              <div className={`mt-1 text-xs px-1 py-1 rounded ${feedback === "correct" ? "bg-green-600/10 border border-green-400 text-green-400" : "bg-red-600/10 border border-red-400 text-red-400"}`}>
                {feedback === "correct" ? "Correcte!" : "Incorrecte"}
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
