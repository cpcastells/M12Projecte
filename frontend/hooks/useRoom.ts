import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import useActiveGame from "@/hooks/useActiveGame";
import { PATHS } from "@/constants/paths";

/** Converteix Room.order (1, 2, 3) al segment d'URL de la sala ("01", "02", "03"). */
function formatRoomUrl(order: number): string {
  return String(order).padStart(2, "0");
}

/**
 * Hook que gestiona l'estat de la sala actual a partir de la partida activa.
 *
 * Redireccions:
 * - Sense partida en cache → /narrative (l'usuari encara no n'ha iniciat cap).
 * - Partida amb status != active (completed/ended) → /game-over.
 * - URL no coincideix amb la sala actual → /room/0X de la sala actual.
 */
const useRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const router = useRouter();
  const { data, isLoading, error } = useActiveGame();

  const game = data?.game ?? null;
  const room = game?.currentRoom ?? null;

  useEffect(() => {
    if (isLoading) return;

    if (!game || error) {
      router.replace(PATHS.NARRATIVE);
      return;
    }

    if (game.status !== "active") {
      router.replace(PATHS.GAME_OVER);
      return;
    }

    if (room && roomId !== formatRoomUrl(room.order)) {
      router.replace(`${PATHS.ROOM}/${formatRoomUrl(room.order)}`);
    }
  }, [isLoading, game, room, roomId, router, error]);

  return {
    room,
    puzzle: room?.puzzle ?? null,
    objects: room?.objects ?? [],
    gameState: game?.state ?? null,
    gameId: game?.id ?? null,
    isLoading,
  };
};

export default useRoom;
