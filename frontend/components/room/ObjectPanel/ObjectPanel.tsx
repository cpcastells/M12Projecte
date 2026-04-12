import type { InteractiveObject } from "@/types/game";

type ObjectPanelProps = {
  object: InteractiveObject | null;
};

const ObjectPanel = ({ object }: ObjectPanelProps) => {
  return (
    <div className="border-t border-cyan-700/30 pt-2">
      <div className="text-cyan-500 uppercase tracking-widest mb-2 text-xs">
        Objecte
      </div>

      <div className="text-cyan-200 text-[11px] bg-black/30 p-2 border border-cyan-800 min-h-15">
        {object ? (
          <>
            <div className="text-cyan-400 font-bold mb-1">{object.name}</div>
            <div>{object.description}</div>
          </>
        ) : (
          <span className="text-cyan-700">Selecciona un objecte</span>
        )}
      </div>
    </div>
  );
};

export default ObjectPanel;
