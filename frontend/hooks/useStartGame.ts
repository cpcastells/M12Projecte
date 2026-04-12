import { useMutation } from "@tanstack/react-query";
import { startGame } from "@/services/game/gameService";
import type { StartGameResponse } from "@/types/game";

const useStartGame = () =>
  useMutation<StartGameResponse, Error>({
    mutationFn: startGame,
  });

export default useStartGame;
