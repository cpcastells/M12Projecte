import { useMutation, useQueryClient } from "@tanstack/react-query";
import { abandonGame } from "@/services/game/gameService";
import type { GameResponse } from "@/types/game";

/**
 * Marca la partida com abandonada i sincronitza la cache activeGame amb el
 * game retornat (ara amb status=abandoned). useRoom detectarà el canvi i
 * redirigirà a /game-over.
 */
const useAbandonGame = () => {
  const queryClient = useQueryClient();

  return useMutation<GameResponse, Error, { gameId: number }>({
    mutationFn: ({ gameId }) => abandonGame(gameId),
    onSuccess: (data) => {
      queryClient.setQueryData<GameResponse>(["activeGame"], data);
    },
  });
};

export default useAbandonGame;
