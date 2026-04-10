import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import FloatingDust from "@/components/effects/FloatingDust/FloatingDust";
import QueryProvider from "@/providers/QueryProvider";
import { AuthProvider } from "@/context/AuthContext";
import { GameProvider } from "@/context/GameContext";

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
  description:
    "Projecte Escape Room Virtual - ABYSS AI, una experiència immersiva ambientada en una estació submarina d'investigació profunda. Explora la narrativa, resol enigmes i descobreix els secrets de l'Abyss AI.",
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
      <body className="bg-abyss-bg text-cyan-50 font-mono min-h-full flex flex-col overflow-x-hidden">
        {/* Tus capas visuales fijas que se verán en TODO el proyecto */}
        <div className="fixed inset-0 pointer-events-none z-20">
          {/* Capa de ruido */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.08] mix-blend-overlay">
            <filter id="grain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="3"
                stitchTiles="stitch"
              />
            </filter>
            <rect width="100%" height="100%" filter="url(#grain)" />
          </svg>
          {/* Partículas flotantes */}
          <FloatingDust />
        </div>

        {/* El contenido de las páginas con un z-index para que esté por encima de los efectos */}
        <QueryProvider>
          <AuthProvider>
            <GameProvider>
              <div className="relative z-10 flex-1 flex flex-col">
                {children}
              </div>
            </GameProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
