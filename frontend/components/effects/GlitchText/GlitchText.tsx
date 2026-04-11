"use client";

import { useEffect, useState } from "react";

const GLITCH_CHARS = "█▓▒░╔╗╚╝║═▄▀■□▪▫";

type GlitchTextProps = {
  text: string;
  className?: string;
};

const GlitchText = ({ text, className }: GlitchTextProps) => {
  const [displayed, setDisplayed] = useState(text);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const glitch = () => {
      const corrupted = text
        .split("")
        .map((char) => {
          if (char === " " || char === "—") return char;
          return Math.random() < 0.12
            ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
            : char;
        })
        .join("");

      setDisplayed(corrupted);

      setTimeout(() => setDisplayed(text), 80);

      timeout = setTimeout(glitch, 1200 + Math.random() * 800);
    };

    timeout = setTimeout(glitch, 600);
    return () => clearTimeout(timeout);
  }, [text]);

  return <span className={className}>{displayed}</span>;
};

export default GlitchText;
