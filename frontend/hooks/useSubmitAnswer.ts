import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitAnswer } from "@/services/game/gameService";
import type { Game, GameResponse, SolveEnigmaResponse } from "@/types/game";

/**
 * Mutation per validar una resposta.
 *
 * - Si la resposta és **incorrecta**, sincronitza la cache ["activeGame"]
 *   immediatament: el backend ja ha actualitzat score i camps de negoci,
 *   i no hi ha canvi de sala.
 * - Si és **correcta**, NO toca la cache automàticament. Això permet al
 *   consumidor (PuzzlePanel) mostrar un overlay de transició abans de
 *   la navegació; `useRoom` redirigeix quan detecta canvi de currentRoom,
 *   així que actualitzar la cache massa aviat faria desaparèixer l'overlay.
 *   El consumidor ha de cridar `applyCache(data.game)` quan vulgui.
 */
const useSubmitAnswer = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    SolveEnigmaResponse,
    Error,
    { gameId: number; answer: string }
  >({
    mutationFn: ({ gameId, answer }) => submitAnswer(gameId, answer),
    onSuccess: (data) => {
      if (data.correct) return;
      // En resposta incorrecta, el backend només retorna l'state actualitzat
      // (no el game sencer). Fusionem dins la cache existent per preservar
      // room/puzzle/etc.
      queryClient.setQueryData<GameResponse>(["activeGame"], (prev) => {
        if (!prev) return prev;
        const nextState = data.state ?? prev.game.state;
        return { game: { ...prev.game, state: nextState } };
      });
    },
  });

  const applyCache = (game: Game) => {
    queryClient.setQueryData<GameResponse>(["activeGame"], { game });
  };

  return { ...mutation, applyCache };
};

export default useSubmitAnswer;
