"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useAskAssistant from "@/hooks/useAskAssistant";
import { ApiError } from "@/services/apiClient";
import { GAME_CONSTANTS } from "@/constants/game";
import type { FaceState } from "@/components/room/AssistantPanel/RobotFace";
import type { Room } from "@/types/game";

export type AssistantMessage = {
  id: string;
  role: "user" | "ai" | "system";
  text: string;
};

const DEFAULT_IDLE_PHRASES = [
  "[SISTEMA OPERATIU] Esperant entrada...",
  "[ABYSS AI] Sensors actius. Profunditat estable.",
  "[CANAL] Comunicació encriptada disponible.",
];

const TYPEWRITER_MS_PER_CHAR = 18;

type Props = {
  room: Room;
  gameId: number;
  aiHintsUsed: number;
  aiEnabled: boolean;
};

/**
 * Centralitza tot l'estat del panell de l'assistent ABYSS AI:
 *
 * - Historial de missatges (usuari / IA / sistema) reiniciat per sala.
 * - Estat de la cara del robot (`idle` → `thinking` → `speaking`) sincronitzat
 *   amb el cicle de la mutation i la durada estimada del typewriter.
 * - Rotació de frases idle pròpies de la sala (fallback a frases per defecte).
 * - Càlcul de pistes IA restants i si l'usuari pot preguntar (`canAsk`).
 * - `sendQuestion`: valida l'entrada, crida `useAskAssistant` i tradueix la
 *   resposta o l'error en missatges + transicions de cara.
 *
 * El hook només exposa dades derivades llestes per a la UI; els components
 * (AssistantPanel, AssistantModal, RobotFace) no haurien de gestionar aquest
 * estat per separat.
 */
const useAssistantState = ({ room, gameId, aiHintsUsed, aiEnabled }: Props) => {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [faceState, setFaceState] = useState<FaceState>("idle");
  const [idleIndex, setIdleIndex] = useState(0);
  const speakingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { mutate, isPending } = useAskAssistant();

  const idlePhrases = useMemo(
    () => (room.idlePhrases?.length ? room.idlePhrases : DEFAULT_IDLE_PHRASES),
    [room.idlePhrases],
  );

  // Reinicia el xat quan canvia la sala
  useEffect(() => {
    setMessages([]);
    setIdleIndex(0);
    setFaceState("idle");
  }, [room.id]);

  // Rotació de frases idle
  useEffect(() => {
    if (idlePhrases.length <= 1) return;
    const id = setInterval(() => {
      setIdleIndex((prev) => (prev + 1) % idlePhrases.length);
    }, 6000);
    return () => clearInterval(id);
  }, [idlePhrases.length]);

  useEffect(() => {
    return () => {
      if (speakingTimer.current) clearTimeout(speakingTimer.current);
    };
  }, []);

  const remaining = Math.max(0, GAME_CONSTANTS.MAX_AI_HINTS - aiHintsUsed);
  const canAsk = aiEnabled && remaining > 0 && !isPending;

  const sendQuestion = useCallback(
    (rawText: string) => {
      const text = rawText.trim();
      if (!text) return;
      if (!canAsk) return;
      if (text.length > 300) return;

      const userMsg: AssistantMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        text,
      };
      setMessages((prev) => [...prev, userMsg]);
      setFaceState("thinking");

      mutate(
        { gameId, question: text },
        {
          onSuccess: (data) => {
            setMessages((prev) => [
              ...prev,
              { id: `a-${Date.now()}`, role: "ai", text: data.reply },
            ]);
            setFaceState("speaking");
            const speakingMs = data.reply.length * TYPEWRITER_MS_PER_CHAR + 600;
            if (speakingTimer.current) clearTimeout(speakingTimer.current);
            speakingTimer.current = setTimeout(
              () => setFaceState("idle"),
              speakingMs,
            );
          },
          onError: (error) => {
            const isFallback =
              error instanceof ApiError && error.status === 502;
            const text = isFallback
              ? error.message
              : error.message || "Connexió interrompuda. Torna-ho a intentar.";
            setMessages((prev) => [
              ...prev,
              { id: `s-${Date.now()}`, role: "system", text },
            ]);
            setFaceState("idle");
          },
        },
      );
    },
    [canAsk, gameId, mutate],
  );

  return {
    messages,
    faceState,
    idlePhrase: idlePhrases[idleIndex] ?? "",
    isPending,
    aiHintsUsed,
    aiHintsRemaining: remaining,
    aiHintsMax: GAME_CONSTANTS.MAX_AI_HINTS,
    aiEnabled,
    canAsk,
    sendQuestion,
  };
};

export type AssistantState = ReturnType<typeof useAssistantState>;

export default useAssistantState;
