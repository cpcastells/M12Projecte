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
 * Responsabilitats:
 * - Obté la partida activa via `useActiveGame` i n'extreu sala, puzzle i objectes.
 * - Redirigeix a /narrative si no hi ha partida activa (protecció de ruta).
 * - Redirigeix a la sala correcta si el roomId de la URL no coincideix
 *   amb la sala actual del joc (restauració d'estat).
 */
const useRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const router = useRouter();
  const { data, isLoading, error } = useActiveGame();

  const game = data?.game ?? null;
  const room = game?.currentRoom ?? null;

  useEffect(() => {
    if (isLoading) return;

    // Sense partida activa → redirigeix a narrativa
    if (!game || error) {
      router.replace(PATHS.NARRATIVE);
      return;
    }

    // URL no coincideix amb sala actual → redirigeix a la sala correcta
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
