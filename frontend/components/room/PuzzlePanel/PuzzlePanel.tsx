"use client";

import { useState } from "react";
import useSubmitAnswer from "@/hooks/useSubmitAnswer";
import type { Puzzle } from "@/types/game";

type PuzzlePanelProps = {
  puzzle: Puzzle;
  gameId: number;
};

const PuzzlePanel = ({ puzzle, gameId }: PuzzlePanelProps) => {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const { mutate, isPending } = useSubmitAnswer();

  const handleSubmit = () => {
    if (!answer.trim() || isPending) return;

    mutate(
      { gameId, answer: answer.trim() },
      {
        onSuccess: (data) => {
          setFeedback(data.correct ? "correct" : "wrong");
          if (data.correct) {
            setAnswer("");
          }
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="border-t border-cyan-700/30 pt-2">
      <div className="text-cyan-500 uppercase tracking-widest mb-2">Enigma</div>

      <div className="text-cyan-200 text-[11px] mb-3">{puzzle.statement}</div>

      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isPending}
        className="w-full mb-2 px-3 py-2 bg-black border border-cyan-800 text-center tracking-widest focus:border-cyan-400 outline-none text-xs"
        placeholder="Introdueix la resposta"
      />

      <button
        onClick={handleSubmit}
        disabled={isPending || !answer.trim()}
        className="w-full border border-cyan-400 py-2 hover:bg-cyan-400 hover:text-black transition text-xs disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isPending ? "VERIFICANT..." : "▶ VERIFICAR"}
      </button>

      {feedback && (
        <div
          className={`mt-2 text-xs px-2 py-1 border ${
            feedback === "correct"
              ? "text-green-400 border-green-400 bg-green-400/10"
              : "text-red-400 border-red-400 bg-red-400/10"
          }`}
        >
          {feedback === "correct" ? "ACCÉS CONCEDIT" : "CODI INCORRECTE"}
        </div>
      )}
    </div>
  );
};

export default PuzzlePanel;
