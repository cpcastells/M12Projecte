/**
 * AudioManager — SSR-safe (Next.js compatible).
 *
 * Els objectes Audio es creen de forma lazy al primer `play()`,
 * evitant errors durant el Server-Side Rendering on `window` no existeix.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SOUNDS = ["alarm", "error", "success", "hint", "acert"] as const;
export type SoundType = (typeof SOUNDS)[number];

const SOUND_PATHS: Record<SoundType, string> = {
  alarm: "/sounds/alarm.mp3",
  error: "/sounds/error.mp3",
  success: "/sounds/success.mp3",

  //Reutilitzaremos un existent
  hint: "/sounds/hint.mp3",
  //To acert puzzle
  acert: "/sounds/acert.mp3",
};

// Cache lazy dels objectes Audio
const audioCache = new Map<SoundType, HTMLAudioElement>();

function getAudio(type: SoundType): HTMLAudioElement | null {
  if (typeof window === "undefined") return null; // SSR guard

  if (!audioCache.has(type)) {
    const audio = new Audio(SOUND_PATHS[type]);
    audio.preload = "auto"; // mejora: carga anticipada
    audioCache.set(type, audio);
  }

  return audioCache.get(type)!;
}

export const AudioManager = {
  play(type: SoundType): void {
    const audio = getAudio(type);
    if (!audio) return;

    // Reiniciar reproducció
    audio.pause(); // evita solapaments
    audio.currentTime = 0;

    // Ajust segon el tipus
    switch (type) {
      case "hint":
        audio.volume = 0.2; // suao
        break;
      case "error":
        audio.volume = 0.6;
        break;
      case "success":
        audio.volume = 0.8;
        break;
      case "alarm":
        audio.volume = 1;
        break;
    }

    audio.play().catch((err) => {
      console.warn("Audio play blocked or failed:", err);
    });
  },
};
