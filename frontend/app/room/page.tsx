"use client";

"use client";

import Navbar from "../../components/layout/Navbar";

export default function RoomPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 border-2 border-cyan-900/20 m-6 flex items-center justify-center relative">
        <span className="absolute top-4 left-4 text-[10px] text-cyan-900 tracking-widest">SALA_D&apos;OPERACIONS_V.1</span>
        <h1 className="text-2xl font-bold text-cyan-600 animate-pulse">SISTEMA EN QUARANTENA</h1>
      </div>
    </main>
  );
}
