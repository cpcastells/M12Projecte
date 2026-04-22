import { useQuery } from "@tanstack/react-query";
import { getLastGame } from "@/services/game/gameService";

/**
 * Retorna l'última partida de l'usuari (qualsevol estat). Usat a /game-over
 * per mostrar el resum d'una partida que acaba de finalitzar o abandonar.
 */
const useLastGame = () =>
  useQuery({
    queryKey: ["lastGame"],
    queryFn: getLastGame,
    retry: false,
  });

export default useLastGame;
