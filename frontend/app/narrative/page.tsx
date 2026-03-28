import Navbar from "@/components/layout/Navbar";
import { NARRATIVE_COPY } from "@/constants/copy/narrative";
import { useRouter } from "next/navigation";

export default function NarrativePage() {
  const router = useRouter(); // Hook de Next.js para navegación programática

  // Función para volver a la landing
  const goToLanding = () => {
    router.push("/");
  };
  const goToRoom01 = () => {
    router.push("/room/01");
  };

  return (
    <main className="min-h-screen bg-abyss-bg text-cyan-50 font-mono flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row border-t border-cyan-900/30">
        {/* Columna esquerra: Visual de l'estació */}
        <div className="w-full md:w-1/2 p-12 flex flex-col items-center justify-center border-r border-cyan-900/20 relative">
          <div className="absolute top-12 left-12 space-y-1">
            <p className="text-[10px] text-cyan-900 tracking-widest">
              {NARRATIVE_COPY.status.station}
            </p>
            <p className="text-[10px] text-red-900/60 tracking-widest animate-pulse">
              {NARRATIVE_COPY.status.alert}
            </p>
          </div>

          {/* Esquema de la càpsula */}
          <div className="w-64 h-100 border-2 border-cyan-900/30 rounded-t-full relative flex items-center justify-center opacity-40">
            <div className="w-full h-px bg-cyan-900/30 absolute top-1/3" />
            <div className="w-full h-px bg-cyan-900/30 absolute top-2/3" />
            <div className="w-4 h-4 rounded-full bg-red-900/50 animate-ping" />
          </div>

          <div className="mt-8 text-[9px] text-cyan-900 tracking-[0.5em] uppercase">
            {NARRATIVE_COPY.status.visualization}
          </div>
        </div>

        {/* Columna dreta: Text narratiu */}
        <div className="w-full md:w-1/2 p-12 md:p-24 overflow-y-auto">
          <header className="mb-12">
            <p className="text-cyan-700 text-[10px] tracking-[0.4em] mb-2 uppercase">
              {NARRATIVE_COPY.header.label}
            </p>
            <h1 className="text-5xl font-black tracking-tighter text-cyan-400 mb-4">
              {NARRATIVE_COPY.header.title}
            </h1>
            <div className="flex gap-4 text-[9px] text-cyan-800 tracking-widest font-bold">
              <span>{NARRATIVE_COPY.header.date}</span>
              <span>—</span>
              <span>{NARRATIVE_COPY.header.time}</span>
              <span className="text-cyan-600">
                {NARRATIVE_COPY.header.encryption}
              </span>
            </div>
          </header>

          <section className="space-y-8 text-cyan-100/70 text-[14px] leading-relaxed max-w-lg">
            {NARRATIVE_COPY.paragraphs.map((p, i) => (
              <p key={i}>
                {p.before}
                <span className={p.highlightClass}>{p.highlight}</span>
                {p.after}
              </p>
            ))}
          </section>

          {/* Consola d'estat */}
          <div className="mt-12 p-6 bg-cyan-950/20 border-l-2 border-cyan-500/50 space-y-1">
            {NARRATIVE_COPY.console.map((line, i) => (
              <p key={i} className={`text-[10px] font-bold ${line.className}`}>
                {line.text}
                {"highlight" in line && (
                  <>
                    <span className={line.highlightClass}>
                      {line.highlight}
                    </span>
                    {line.suffix}
                  </>
                )}
              </p>
            ))}
          </div>

          {/* Botons d'acció */}
          <div className="mt-12 flex items-center gap-8">
            {/* Botón principal → Sala 01 */}
            <button
              onClick={goToRoom01}
              className="px-10 py-4 bg-cyan-500 text-black font-black text-[10px] tracking-[0.3em] uppercase hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)]"
            >
              ▶ {NARRATIVE_COPY.cta.primary}
            </button>

            {/* Botón secundario → volver al landing */}
            <button
              onClick={goToLanding}
              className="text-[9px] text-cyan-900 tracking-widest uppercase hover:text-cyan-400 transition-colors"
            >
              ⇠ {NARRATIVE_COPY.cta.secondary}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
