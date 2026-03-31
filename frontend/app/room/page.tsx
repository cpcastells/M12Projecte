"use client";

import Navbar from "../../components/layout/Navbar";
import { useRouter } from "next/navigation";

export default function RoomPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 border-2 border-cyan-900/20 m-6 flex flex-col items-center justify-center relative">
        <span className="absolute top-4 left-4 text-[10px] text-cyan-900 tracking-widest">
          SALA_D&apos;OPERACIONS_V.1
        </span>

        <h1 className="text-2xl font-bold text-cyan-600 animate-pulse">
          SISTEMA EN QUARANTENA
        </h1>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => router.push("/sala1")}
            className="px-4 py-2 bg-cyan-500 text-black font-bold hover:bg-cyan-400"
          >
            Sala 01
          </button>
          <button
            onClick={() => router.push("/sala2")}
            className="px-4 py-2 bg-cyan-500 text-black font-bold hover:bg-cyan-400"
          >
            Sala 02
          </button>
          <button
            onClick={() => router.push("/sala3")}
            className="px-4 py-2 bg-cyan-500 text-black font-bold hover:bg-cyan-400"
          >
             Sala 03
          </button>
        </div>
      </div>
    </main>
  );
}
