"use client";

import { useEffect, useState } from "react";
import { useGameContext } from "@/context/GameContext";

/**
 * Indicador del progrés de save. Té tres estats visuals:
 * - Guardant... (pulse cian) mentre isSaving
 * - Progrés desat (verd, fade-out a 2s) després d'un save correcte
 * - Error en desar (vermell, persistent fins el proper save reeixit) si saveError
 */
const SAVED_FADE_MS = 2000;

const SaveIndicator = () => {
  const { isSaving, lastSavedAt, saveError } = useGameContext();
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (!lastSavedAt) return;
    setShowSaved(true);
    const timeout = setTimeout(() => setShowSaved(false), SAVED_FADE_MS);
    return () => clearTimeout(timeout);
  }, [lastSavedAt]);

  if (isSaving) {
    return (
      <div className="text-cyan-700 text-[9px] tracking-widest animate-pulse">
        GUARDANT...
      </div>
    );
  }

  if (saveError) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="text-red-400 text-[9px] tracking-widest border border-red-500/40 bg-red-500/10 px-2 py-1"
      >
        ERROR EN DESAR
      </div>
    );
  }

  if (showSaved) {
    return (
      <div className="text-green-700 text-[9px] tracking-widest transition-opacity">
        PROGRÉS DESAT
      </div>
    );
  }

  return null;
};

export default SaveIndicator;
