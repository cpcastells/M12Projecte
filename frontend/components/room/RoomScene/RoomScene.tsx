import type { InteractiveObject } from "@/types/game";

type RoomSceneProps = {
  objects: InteractiveObject[];
  selectedObjectId: number | null;
  onSelectObject: (object: InteractiveObject) => void;
  doorUnlocked?: boolean;
};

/**
 * Posicions predefinides per als 3 objectes de cada sala.
 * El seed garanteix exactament 3 objectes per sala.
 */
const OBJECT_POSITIONS = [
  { x: 60, y: 100, width: 180, height: 300 },
  { x: 560, y: 80, width: 200, height: 360 },
  { x: 330, y: 180, width: 140, height: 280 },
];

const RoomScene = ({
  objects,
  selectedObjectId,
  onSelectObject,
  doorUnlocked = false,
}: RoomSceneProps) => {
  return (
    <div className="relative overflow-hidden flex-1">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(0,50,80,0.3),transparent)]" />

      <svg
        className="absolute inset-0 w-full h-full opacity-80"
        viewBox="0 0 800 600"
      >
        <rect width="800" height="600" fill="#020a10" />

        {objects.map((obj, i) => {
          const pos = OBJECT_POSITIONS[i];
          if (!pos) return null;

          const isSelected = obj.id === selectedObjectId;
          const isDoor = obj.type === "door";
          const strokeColor = isDoor
            ? doorUnlocked
              ? "#00ff99"
              : "#ff333366"
            : isSelected
              ? "#00e5ff"
              : "#00e5ff33";
          const fillColor = isDoor
            ? doorUnlocked
              ? "#022f1f"
              : "#050f16"
            : "#071926";

          return (
            <g key={obj.id}>
              <rect
                x={pos.x}
                y={pos.y}
                width={pos.width}
                height={pos.height}
                fill={fillColor}
                stroke={strokeColor}
              />
              <text
                x={pos.x + pos.width / 2}
                y={pos.y + 20}
                textAnchor="middle"
                fill={
                  isDoor ? (doorUnlocked ? "#00ff99" : "#ff3333") : "#00e5ff"
                }
                fontSize="12"
              >
                {obj.name.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>

      {objects.map((obj, i) => {
        const pos = OBJECT_POSITIONS[i];
        if (!pos) return null;

        return (
          <div
            key={obj.id}
            onClick={() => onSelectObject(obj)}
            className="absolute cursor-pointer group"
            style={{
              left: pos.x,
              top: pos.y,
              width: pos.width,
              height: pos.height,
            }}
          >
            <div className="absolute inset-0 border border-transparent group-hover:border-cyan-400 transition" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-cyan-400 blur-xl transition" />
          </div>
        );
      })}

      {doorUnlocked && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-green-400 text-sm tracking-widest animate-pulse">
          PORTA DESBLOQUEJADA
        </div>
      )}
    </div>
  );
};

export default RoomScene;
