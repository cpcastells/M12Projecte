import { useMutation, useQueryClient } from "@tanstack/react-query";
import { askAssistant } from "@/services/game/gameService";
import type {
  AskAssistantRequest,
  AskAssistantResponse,
  GameResponse,
} from "@/types/game";

/**
 * Mutation per consultar l'assistent ABYSS AI. Sincronitza la cache de
 * ["activeGame"] amb el nou state retornat pel backend, perquè qualsevol
 * consumidor (AssistantPanel, HudPanel, etc.) llegeixi el comptador
 * d'aiHintsUsed i la puntuació canònica.
 */
const useAskAssistant = () => {
  const queryClient = useQueryClient();

  return useMutation<AskAssistantResponse, Error, AskAssistantRequest>({
    mutationFn: ({ gameId, question }) => askAssistant(gameId, question),
    onSuccess: (data) => {
      queryClient.setQueryData<GameResponse>(["activeGame"], (prev) => {
        if (!prev) return prev;
        return { game: { ...prev.game, state: data.state } };
      });
    },
  });
};

export default useAskAssistant;
