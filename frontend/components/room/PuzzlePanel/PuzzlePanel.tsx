"use client";

import { useEffect, useRef, useState } from "react";
import useSubmitAnswer from "@/hooks/useSubmitAnswer";
import { GAME_CONSTANTS } from "@/constants/game";
import RoomTransitionOverlay from "@/components/room/RoomTransitionOverlay/RoomTransitionOverlay";
import type { Puzzle } from "@/types/game";
import { AudioManager } from "@/utils/AudioManager";

type PuzzlePanelProps = {
  puzzle: Puzzle;
  gameId: number;
};

type FeedbackState =
  | { kind: "wrong" }
  | { kind: "error"; message: string }
  | { kind: "idle" };

const WRONG_ANSWER_AUTO_CLEAR_MS = 5000;
const ROOM_TRANSITION_SECONDS = 5;
const ROOM_TRANSITION_MS = ROOM_TRANSITION_SECONDS * 1000;

const PuzzlePanel = ({ puzzle, gameId }: PuzzlePanelProps) => {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>({ kind: "idle" });
  const [showTransition, setShowTransition] = useState(false);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrongClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { mutate, isPending, applyCache } = useSubmitAnswer();

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      if (wrongClearTimerRef.current) clearTimeout(wrongClearTimerRef.current);
    };
  }, []);

  const handleSubmit = () => {
    if (!answer.trim() || isPending || showTransition) return;

    setFeedback({ kind: "idle" });
    if (wrongClearTimerRef.current) clearTimeout(wrongClearTimerRef.current);

    mutate(
      { gameId, answer: answer.trim() },
      {
        onSuccess: (data) => {
          if (data.correct && data.game) {
            setAnswer("");

            AudioManager.play("acert");

            setShowTransition(true);
            const game = data.game;
            transitionTimerRef.current = setTimeout(() => {
              applyCache(game);
            }, ROOM_TRANSITION_MS);
            return;
          }
          setFeedback({ kind: "wrong" });
          AudioManager.play("error"); //Comentari error
          wrongClearTimerRef.current = setTimeout(() => {
            setFeedback({ kind: "idle" });
          }, WRONG_ANSWER_AUTO_CLEAR_MS);
        },
        onError: (error) => {
          setFeedback({
            kind: "error",
            message:
              error.message ??
              "No s'ha pogut contactar amb el servidor. Torna-ho a intentar.",
          });
        },
      },
    );
  };

  const handleAnswerChange = (value: string) => {
    setAnswer(value);
    if (feedback.kind === "wrong" || feedback.kind === "error") {
      if (wrongClearTimerRef.current) clearTimeout(wrongClearTimerRef.current);
      setFeedback({ kind: "idle" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  const inputsDisabled = isPending || showTransition;

  return (
    <>
      <div className="border-t border-cyan-700/30 pt-2">
        <div className="text-cyan-500 uppercase tracking-widest mb-2">
          Enigma
        </div>

        <div className="text-cyan-200 text-[11px] mb-3">{puzzle.statement}</div>

        <input
          value={answer}
          onChange={(e) => handleAnswerChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={inputsDisabled}
          className="w-full mb-2 px-3 py-2 bg-black border border-cyan-800 text-center tracking-widest focus:border-cyan-400 outline-none text-xs disabled:opacity-50"
          placeholder="Introdueix la resposta"
        />

        <button
          onClick={handleSubmit}
          disabled={inputsDisabled || !answer.trim()}
          className="w-full border border-cyan-400 py-2 hover:bg-cyan-400 hover:text-black transition text-xs disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? "VERIFICANT..." : "▶ VERIFICAR"}
        </button>

        {feedback.kind === "wrong" && (
          <div
            role="status"
            aria-live="polite"
            className="mt-2 text-xs px-2 py-1 border text-red-400 border-red-400 bg-red-400/10 flex justify-between items-center"
          >
            <span>CODI INCORRECTE</span>
            <span className="text-[10px] tracking-widest">
              −{GAME_CONSTANTS.SCORE_WRONG_ANSWER_PENALTY} PTS
            </span>
          </div>
        )}

        {feedback.kind === "error" && (
          <div
            role="alert"
            aria-live="assertive"
            className="mt-2 text-xs px-2 py-1 border text-amber-300 border-amber-500/60 bg-amber-500/10"
          >
            {feedback.message}
          </div>
        )}
      </div>

      {showTransition && (
        <RoomTransitionOverlay countdownFromSeconds={ROOM_TRANSITION_SECONDS} />
      )}
    </>
  );
};

export default PuzzlePanel;
