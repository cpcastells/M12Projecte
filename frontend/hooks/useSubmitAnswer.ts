import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitAnswer } from "@/services/game/gameService";
import type { GameResponse, SolveEnigmaResponse } from "@/types/game";

/**
 * Mutation per validar una resposta. Sempre sincronitza la cache
 * ["activeGame"] amb el `game` retornat pel backend (tant si la resposta és
 * correcta com si no), perquè el `state` persistit pot haver canviat en
 * ambdós casos (score, currentRoom, unlockedRoomIds...).
 */
const useSubmitAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SolveEnigmaResponse,
    Error,
    { gameId: number; answer: string }
  >({
    mutationFn: ({ gameId, answer }) => submitAnswer(gameId, answer),
    onSuccess: (data) => {
      queryClient.setQueryData<GameResponse>(["activeGame"], {
        game: data.game,
      });
    },
  });
};

export default useSubmitAnswer;
