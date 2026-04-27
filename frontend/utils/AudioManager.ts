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
  success: "/sounds/succes.mp3",

  //Reutilitzaremos un existent
  hint: "/sounds/hint.mp3",
  //To acert puzzle
  acert: "/sounds/acert.mp3",
};
const SOUND_VOLUME: Record<SoundType, number> = {
  hint: 0.2,
  error: 0.6,
  success: 0.8,
  alarm: 1.0,
  acert: 0.8,
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

//Audio ambient

const AMBIENT_PATH = "/sounds/soundSala01.mp3";
let ambientAudio: HTMLAudioElement | null = null;
let playPromise: Promise<void> | null = null;
let isStopping = false;

//AudioManager
export const AudioManager = {
  /**
   * Cridar des d'un event d'usuari (p.ex. clic a /narrative).
   * Crea un AudioContext i el resumeix — això desbloqueja l'autoplay
   * per a tot el document durant la resta de la sessió.
   */
  unlockAudio(): void {
    if (typeof window === "undefined") return;
    try {
      const ctx = new AudioContext();
      ctx.resume().then(() => ctx.close());
    } catch {
      // Navegadors antics sense AudioContext — ignorar
    }
  },

  play(type: SoundType): void {
    const audio = getAudio(type);
    if (!audio) return;

    // Reiniciar reproducció
    audio.pause(); // evita solapaments
    audio.currentTime = 0;

    // Ajust segon el tipus
    audio.volume = SOUND_VOLUME[type];
    audio.play().catch(() => {});
  },

  playAmbient(): void {
    if (typeof window === "undefined") return;

    if (!ambientAudio) {
      ambientAudio = new Audio(AMBIENT_PATH);
      ambientAudio.loop = true;
      ambientAudio.volume = 0.18;
    }

    if (!ambientAudio.paused) return;

    isStopping = false;
    playPromise = ambientAudio.play().catch((err) => {
      if ((err as DOMException).name !== "AbortError") {
        console.warn("Ambient autoplay blocked:", err);
      }
    });
  },

  stopAmbient(): void {
    if (!ambientAudio) return;
    isStopping = true;

    const stop = () => {
      ambientAudio?.pause();
      if (ambientAudio) ambientAudio.currentTime = 0;
    };

    if (playPromise) {
      playPromise.finally(() => {
        if (isStopping) stop();
      });
      playPromise = null;
    } else {
      stop();
    }
  },
  isAmbientPlaying(): boolean {
    return ambientAudio !== null && !ambientAudio.paused;
  },
};
