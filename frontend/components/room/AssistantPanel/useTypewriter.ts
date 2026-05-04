"use client";

import { useEffect, useState } from "react";

/**
 * Revela `text` caràcter a caràcter a `speedMs` ms per char.
 * Reseteja l'animació quan canvia el text d'entrada.
 */
const useTypewriter = (text: string, speedMs = 18) => {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    setDisplay("");
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setDisplay(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speedMs);
    return () => clearInterval(id);
  }, [text, speedMs]);

  return { display, done: display.length === text.length };
};

export default useTypewriter;
