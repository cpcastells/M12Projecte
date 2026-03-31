import Navbar from "@/components/layout/Navbar";
import { LANDING_COPY } from "@/constants/copy/landing";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter(); // Hook de Next.js para navegación programática

  // Función para ir a narrativa
  const goToNarrative = () => {
    router.push("/narrative");
  };

  return (
    <main className="min-h-screen text-cyan-50 font-mono flex flex-col items-center selection:bg-cyan-950 overflow-hidden relative">
      <Navbar />

      {/* Contingut principal */}
      <div className="flex-1 flex flex-col items-center justify-center text-center z-10 px-6 max-w-4xl">
        {/* Localització superior */}
        <div className="text-[10px] tracking-[0.6em] text-cyan-900 mb-8 flex items-center gap-4">
          <div className="h-px w-12 bg-cyan-900" />
          {LANDING_COPY.location}
          <div className="h-px w-12 bg-cyan-900" />
        </div>

        {/* Títol principal */}
        <div className="mb-8">
          <h1 className="text-7xl md:text-9xl font-black tracking-widest leading-none mb-2 drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            {LANDING_COPY.title}
          </h1>
          <h1 className="text-7xl md:text-9xl font-black tracking-widest leading-none text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            {LANDING_COPY.titleAccent}
          </h1>
        </div>

        {/* Subtítol */}
        <h2 className="text-xs md:text-sm tracking-[0.4em] text-cyan-600 uppercase mb-12">
          {LANDING_COPY.subtitle}
        </h2>

        {/* Text narratiu */}
        <div className="space-y-6 text-cyan-800 text-[13px] leading-relaxed max-w-2xl font-light">
          {LANDING_COPY.narrative.map((p, i) => (
            <p key={i}>
              {p.before}
              <span
                className={
                  i === 0
                    ? "text-cyan-400/60 font-bold tracking-widest italic"
                    : "text-cyan-500"
                }
              >
                {p.highlight}
              </span>
              {p.after}
            </p>
          ))}
        </div>

      {/* Botons d'acció */}
        <div className="mt-16 flex flex-col items-center gap-6 w-full">
          <button
            onClick={goToNarrative} // <-- Esto redirige a /narrative
            className="group relative px-20 py-4 border border-cyan-400 text-cyan-400 text-xs tracking-[0.4em] uppercase transition-all hover:bg-cyan-400 hover:text-black"
          >
            <span className="relative z-10 font-bold">
              ▶ {LANDING_COPY.ctaPrimary}
            </span>
          </button>

          <div className="flex gap-12 text-[9px] tracking-[0.3em] text-cyan-900 uppercase font-bold">
            {LANDING_COPY.ctaSecondary.map((cta) => {
              // Mapear label a ruta
              let target = "/";
              if (cta.label.toLowerCase() === "instruccions") target = "/instruccions";
              if (cta.label.toLowerCase() === "el meu perfil") target = "/profile";

              return (
                <button
                  key={cta.label}
                  onClick={() => router.push(target)}
                  className="hover:text-cyan-400 transition-colors"
                >
                  {cta.label}
                </button>
              );
            })}
          </div>
        </div>
       </div>
      {/* Footer stats */}
      <footer className="w-full max-w-5xl grid grid-cols-4 border-t border-cyan-900/30 p-10 z-10">
        {LANDING_COPY.stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`text-center group ${i < LANDING_COPY.stats.length - 1 ? "border-r border-cyan-900/30" : ""}`}
          >
            <div
              className={`text-2xl font-bold mb-1 ${stat.accent ? "text-cyan-400" : "text-cyan-50"}`}
            >
              {stat.value}
            </div>
            <div className="text-[8px] tracking-[0.3em] text-cyan-900 group-hover:text-cyan-600 transition-colors uppercase">
              {stat.label}
            </div>
          </div>
        ))}
      </footer>
    </main>
  );
}
