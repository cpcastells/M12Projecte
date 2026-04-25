import Image from "next/image";
import type { InteractiveObject, Room } from "@/types/game";

type RoomSceneProps = {
  room: Room;
  objects: InteractiveObject[];
  selectedObjectId: number | null;
  onSelectObject: (object: InteractiveObject) => void;
  doorUnlocked?: boolean;
};

type Hotspot = {
  left: string;
  top: string;
  width: string;
  height: string;
};

/**
 * Posicions dels hotspots alineades amb les imatges de fons de cada sala.
 * Mapejades per `room.code` + `object.name` per ser robustes davant canvis d'ordre.
 */
const HOTSPOTS_BY_ROOM: Record<string, Record<string, Hotspot>> = {
  ROOM_1: {
    "Terminal A": { left: "11%", top: "30%", width: "19%", height: "55%" },
    "Panell de Control": {
      left: "30%",
      top: "12%",
      width: "22%",
      height: "63%",
    },
    "Llibreta de Bitàcora": {
      left: "55%",
      top: "58%",
      width: "30%",
      height: "38%",
    },
  },
  ROOM_2: {
    Microscopi: { left: "42%", top: "22%", width: "25%", height: "55%" },
    "Tub d’assaig": { left: "65%", top: "48%", width: "25%", height: "45%" },
    "Taula de laboratori": {
      left: "3%",
      top: "48%",
      width: "40%",
      height: "48%",
    },
  },
  ROOM_3: {
    "Panell Final": { left: "75%", top: "26%", width: "20%", height: "45%" },
    "Porta de Sortida": {
      left: "30%",
      top: "10%",
      width: "40%",
      height: "80%",
    },
    "Kit d’emergència": {
      left: "2%",
      top: "55%",
      width: "25%",
      height: "42%",
    },
  },
};

/** Fallback si arriba una sala/objecte sense coordenades definides. */
const FALLBACK_HOTSPOTS: Hotspot[] = [
  { left: "8%", top: "30%", width: "22%", height: "45%" },
  { left: "40%", top: "25%", width: "22%", height: "55%" },
  { left: "70%", top: "30%", width: "22%", height: "50%" },
];

const RoomScene = ({
  room,
  objects,
  selectedObjectId,
  onSelectObject,
  doorUnlocked = false,
}: RoomSceneProps) => {
  return (
    <div className="relative overflow-hidden flex-1 bg-[#020a10]">
      {room.image && (
        <Image
          src={room.image}
          alt={room.name}
          fill
          priority
          sizes="(min-width: 768px) calc(100vw - 320px), 100vw"
          className="object-cover"
        />
      )}

      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(0,50,80,0.35),transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-b from-[#020a10]/40 via-transparent to-[#020a10]/60"
      />

      {objects.map((obj, i) => {
        const pos =
          HOTSPOTS_BY_ROOM[room.code]?.[obj.name] ?? FALLBACK_HOTSPOTS[i];
        if (!pos) return null;

        const isSelected = obj.id === selectedObjectId;
        const isDoor = obj.type === "door";
        const isInteractive = obj.isInteractive !== false;

        const borderColor = isDoor
          ? doorUnlocked
            ? "border-green-400"
            : "border-red-500/40"
          : isSelected
            ? "border-cyan-300"
            : "border-cyan-400/30";

        const labelColor = isDoor
          ? doorUnlocked
            ? "text-green-400"
            : "text-red-400"
          : "text-cyan-300";

        return (
          <button
            key={obj.id}
            type="button"
            onClick={() => isInteractive && onSelectObject(obj)}
            disabled={!isInteractive}
            aria-label={obj.name}
            className={`absolute group transition ${
              isInteractive ? "cursor-pointer" : "cursor-default"
            }`}
            style={{
              left: pos.left,
              top: pos.top,
              width: pos.width,
              height: pos.height,
            }}
          >
            <div
              className={`absolute inset-0 border-2 ${borderColor} rounded-sm transition ${
                isInteractive
                  ? "group-hover:border-cyan-300 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]"
                  : ""
              } ${isSelected ? "shadow-[0_0_24px_rgba(0,229,255,0.6)]" : ""}`}
            />
            <div
              className={`absolute inset-0 transition ${
                isInteractive ? "bg-cyan-400/0 group-hover:bg-cyan-400/10" : ""
              } ${isSelected ? "bg-cyan-400/15" : ""}`}
            />
            <span
              className={`absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] tracking-[0.2em] font-semibold ${labelColor} drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]`}
            >
              {obj.name.toUpperCase()}
            </span>
          </button>
        );
      })}

      {doorUnlocked && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-green-400 text-sm tracking-widest animate-pulse drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
          PORTA DESBLOQUEJADA
        </div>
      )}
    </div>
  );
};

export default RoomScene;
