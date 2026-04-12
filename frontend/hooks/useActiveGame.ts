import { useQuery } from "@tanstack/react-query";
import { getActiveGame } from "@/services/game/gameService";

const useActiveGame = () =>
  useQuery({
    queryKey: ["activeGame"],
    queryFn: getActiveGame,
    retry: false,
  });

export default useActiveGame;
