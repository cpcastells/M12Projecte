import { useEffect } from "react";
import { AudioManager } from "@/utils/AudioManager";

const useAmbientSound = (): void => {
  useEffect(() => {
    let started = false;

    const start = () => {
      if (started) return;
      AudioManager.playAmbient();
      setTimeout(() => {
        if (AudioManager.isAmbientPlaying()) {
          started = true;
          removeListeners();
        }
      }, 300);
    };

    const removeListeners = () => {
      window.removeEventListener("click", start);
      window.removeEventListener("keydown", start);
      window.removeEventListener("touchstart", start);
    };

    start();

    window.addEventListener("click", start);
    window.addEventListener("keydown", start);
    window.addEventListener("touchstart", start);

    return () => {
      removeListeners();
      AudioManager.stopAmbient();
    };
  }, []);
};

export default useAmbientSound;
