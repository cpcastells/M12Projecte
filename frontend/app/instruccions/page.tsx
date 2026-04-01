"use client";
import Navbar from "@/components/layout/Navbar";
import { INSTRUCTIONS_COPY } from "@/constants/copy/instruccions";
import { useRouter } from "next/navigation";

export default function InstructionsPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-abyss-bg text-cyan-50 font-mono flex flex-col">
      <Navbar />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-4xl border border-cyan-500/30 bg-cyan-950/20 p-10 shadow-[0_0_40px_rgba(34,211,238,0.1)]">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-xl tracking-widest text-cyan-400">
              {INSTRUCTIONS_COPY.title}
            </h1>

            <button
              onClick={() => router.push("/")}
              className="text-cyan-500 hover:text-cyan-300"
            >
              ✕
            </button>
          </div>

          {/* SUBTITLE */}
          <p className="text-cyan-700 text-sm mb-8 leading-relaxed">
            {INSTRUCTIONS_COPY.subtitle}
          </p>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {INSTRUCTIONS_COPY.steps.map(
              (step: { num: string; title: string; desc: string }) => (
                <div
                  key={step.num}
                  className="border border-cyan-500/20 p-6 relative"
                >
                  <span className="absolute top-2 right-4 text-cyan-800 text-xs">
                    {step.num}
                  </span>
                  <h3 className="text-cyan-400 font-bold mb-2">{step.title}</h3>
                  <p className="text-cyan-700 text-sm">{step.desc}</p>
                </div>
              ),
            )}
          </div>

          {/* ALERT */}
          <div className="border-l-2 border-yellow-500 p-4 text-yellow-400 text-sm mb-8">
            {INSTRUCTIONS_COPY.alert}
          </div>

          {/* CONTROLS */}
          <div className="text-cyan-700 text-sm space-y-1 mb-10">
            <p className="text-cyan-500 mb-2">CONTROLS BÀSICS:</p>
            {INSTRUCTIONS_COPY.controls.map((c, index) => (
              <p key={index}>{c}</p>
            ))}
          </div>

          {/* FOOTER */}

          <div className="flex justify-between">
            <button
              onClick={() => router.push("/")}
              className="text-cyan-600 hover:text-cyan-400 text-sm"
            >
              {INSTRUCTIONS_COPY.cta.secondary}
            </button>

            <button
              onClick={() => router.push("/narrative")}
              className="px-6 py-3 bg-cyan-500 text-black font-bold text-sm tracking-widest hover:bg-cyan-400"
            >
              ▶ {INSTRUCTIONS_COPY.cta.primary}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
