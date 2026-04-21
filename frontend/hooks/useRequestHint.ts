import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestHint } from "@/services/game/gameService";
import type { GameResponse, UseHintResponse } from "@/types/game";

/**
 * Mutation per demanar una pista. Al rebre la resposta, sincronitza la cache
 * de ["activeGame"] amb el nou state retornat pel backend, perquè qualsevol
 * consumidor (HintsPanel, HudPanel, etc.) llegeixi el valor canònic sense
 * dependre d'una còpia local.
 */
const useRequestHint = () => {
  const queryClient = useQueryClient();

  return useMutation<UseHintResponse, Error, { gameId: number }>({
    mutationFn: ({ gameId }) => requestHint(gameId),
    onSuccess: (data) => {
      queryClient.setQueryData<GameResponse>(["activeGame"], (prev) => {
        if (!prev) return prev;
        return { game: { ...prev.game, state: data.state } };
      });
    },
  });
};

export default useRequestHint;
