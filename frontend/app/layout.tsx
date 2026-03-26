import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Usamos tus metadatos personalizados
export const metadata: Metadata = {
  title: "ABYSS AI - Estació Submarina",
  description: "Projecte Escape Room Virtual - ABYSS AI, una experiència immersiva ambientada en una estació submarina d'investigació profunda. Explora la narrativa, resol enigmes i descobreix els secrets de l'Abyss AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   return (
    <html
      lang="ca"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-[#02080a] text-cyan-50 font-mono min-h-full flex flex-col overflow-x-hidden">
        {/* Tus capas visuales fijas que se verán en TODO el proyecto */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {/* Capa de ruido */}
          <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
               style={{ backgroundImage: `url('https://grainy-gradients.vercel.app')` }} />
          {/* Partículas flotantes */}
          <FloatingDust />
        </div>

         {/* El contenido de las páginas con un z-index para que esté por encima de los efectos */}
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}

// ─── Componentes Visuales Fijos ───────────────────────────────────────────────

function FloatingDust() {
  const [mounted, setMounted] = React.useState(false);
  const [particles, setParticles] = React.useState<Particle[]>([]);

  React.useEffect(() => {
    setMounted(true);
    const initial = Array.from({ length: 40 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 2, opacity: Math.random() * 0.5,
      drift: (Math.random() - 0.5) * 0.02, speed: Math.random() * 0.01,
    }));
    setParticles(initial);
    const interval = setInterval(() => {
      setParticles(p => p.map(pt => ({ ...pt, y: pt.y - pt.speed > -2 ? pt.y - pt.speed : 102 })));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {particles.map(p => (
        <div key={p.id} className="absolute bg-cyan-900 rounded-full"
             style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.opacity }} />
      ))}
    </div>
  );
}

interface Particle {
  id: number; x: number; y: number; size: number;
  opacity: number; drift: number; speed: number;
}
