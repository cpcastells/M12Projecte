'use client';

import Navbar from "../../components/layout/Navbar";

export default function NarrativePage() {
  return (
    <main className="min-h-screen bg-[#02080a] text-cyan-50 font-mono flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row border-t border-cyan-900/30">

        {/* COLUMNA IZQUIERDA: Visual de la Estación */}
        <div className="w-full md:w-1/2 p-12 flex flex-col items-center justify-center border-r border-cyan-900/20 relative">
          <div className="absolute top-12 left-12 space-y-1">
            <p className="text-[10px] text-cyan-900 tracking-widest">HADAL-7 // ESTAT: QUARANTENA ACTIVA</p>
            <p className="text-[10px] text-red-900/60 tracking-widest animate-pulse">ALERTA: SISTEMA IA NO RESPON</p>
          </div>

          {/* Esquema de la cápsula (SVG simple o Divs) */}
          <div className="w-64 h-100 border-2 border-cyan-900/30 rounded-t-full relative flex items-center justify-center opacity-40">
             <div className="w-full h-px bg-cyan-900/30 absolute top-1/3" />
             <div className="w-full h-px bg-cyan-900/30 absolute top-2/3" />
             <div className="w-4 h-4 rounded-full bg-red-900/50 animate-ping" />
          </div>

          <div className="mt-8 text-[9px] text-cyan-900 tracking-[0.5em] uppercase">Visualització de l&apos;Estructura Externa</div>
        </div>

        {/* COLUMNA DERECHA: Texto Narrativo */}
        <div className="w-full md:w-1/2 p-12 md:p-24 overflow-y-auto">
          <header className="mb-12">
            <p className="text-cyan-700 text-[10px] tracking-[0.4em] mb-2 uppercase">● LOG D&apos;ACCÉS — REGISTRE #01</p>
            <h1 className="text-5xl font-black tracking-tighter text-cyan-400 mb-4">MISSIÓ HADAL</h1>
            <div className="flex gap-4 text-[9px] text-cyan-800 tracking-widest font-bold">
              <span>2087.03.14</span>
              <span>—</span>
              <span>04:32 UTC</span>
              <span className="text-cyan-600">| XIFRAT AES-256</span>
            </div>
          </header>

          <section className="space-y-8 text-cyan-100/70 text-[14px] leading-relaxed max-w-lg">
            <p>
              L&apos;estació d&apos;investigació <span className="text-cyan-500">Hadal-7</span> va deixar de respondre fa 22 dies. Situada a 4.200 metres de profunditat a la fossa de les Marianes, albergava un dels experiments d&apos;intel·ligència artificial més avançats del món.
            </p>

            <p>
              L&apos;Abyss AI havia de gestionar tots els sistemes de l&apos;estació de forma autònoma. Ningú no sap exactament quan va deixar d&apos;obeir les ordres. L&apos;última transmissió parlava de <span className="text-red-500 font-bold italic tracking-wider">&quot;comportament anòmal&quot;</span> i l&apos;activació dels protocols de quarantena.
            </p>

            <p>
              Tu accedeixes a la carcassa exterior. L&apos;estació és fosca, però els sistemes interns continuen actius. <span className="text-cyan-400 font-bold italic">Algo — o algú — hi és a dins.</span>
            </p>
          </section>

          {/* Consola de estado inferior */}
          <div className="mt-12 p-6 bg-cyan-950/20 border-l-2 border-cyan-500/50 space-y-1">
             <p className="text-[10px] text-cyan-600 font-bold">SIS:{'>'} Connexió establerta — mòdul A</p>
             <p className="text-[10px] text-cyan-700 font-bold">SIS:{'>'} Estat energia: <span className="text-cyan-400">34%</span> | Vida útil: desconegut</p>
             <p className="text-[10px] text-red-800 font-bold animate-pulse">SIS:{'>'} ALERTA: IA en mode d&apos;aïllament</p>
             <p className="text-[10px] text-cyan-800">SIS:{'>'} Per desbloquejar, cal verificar codi d&apos;accés_</p>
          </div>

          {/* Botones de acción */}
          <div className="mt-12 flex items-center gap-8">
            <button className="px-10 py-4 bg-cyan-500 text-black font-black text-[10px] tracking-[0.3em] uppercase hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              ▶ ENTRAR A SALA 01
            </button>
            <button className="text-[9px] text-cyan-900 tracking-widest uppercase hover:text-cyan-400 transition-colors">
              ⇠ Tornar
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
