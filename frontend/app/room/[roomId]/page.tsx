"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import RoomScene from "@/components/room/RoomScene/RoomScene";
import HudPanel from "@/components/room/HudPanel/HudPanel";
import AssistantPanel from "@/components/room/AssistantPanel/AssistantPanel";
import SaveIndicator from "@/components/room/SaveIndicator/SaveIndicator";
import TimeExpiredGuard from "@/components/room/TimeExpiredGuard/TimeExpiredGuard";
import { GameProvider } from "@/context/GameContext";
import useRoom from "@/hooks/useRoom";
import type { InteractiveObject } from "@/types/game";
import useAmbientSound from "@/hooks/useAmbientSound";

export default function RoomPage() {
  const { room, objects, gameId, gameState, isLoading } = useRoom();
  const [selectedObject, setSelectedObject] =
    useState<InteractiveObject | null>(null);

  //Introducció so ambient
  useAmbientSound();

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#030d14] text-cyan-400">
        <div className="animate-pulse tracking-widest text-sm">
          CARREGANT SALA...
        </div>
      </main>
    );
  }

  if (!room || !gameId || !gameState) return null;

  return (
    <GameProvider
      gameId={gameId}
      initialTimeRemainingSeconds={gameState.timeRemainingSeconds}
    >
      <main className="min-h-screen flex flex-col bg-[#030d14] text-cyan-400">
        <Navbar />

        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] flex-1">
          <RoomScene
            room={room}
            objects={objects}
            selectedObjectId={selectedObject?.id ?? null}
            onSelectObject={setSelectedObject}
          />

          <HudPanel
            room={room}
            selectedObject={selectedObject}
            gameId={gameId}
          />
        </div>

        <div className="fixed bottom-4 left-4">
          <SaveIndicator />
        </div>

        <AssistantPanel room={room} gameId={gameId} />

        <TimeExpiredGuard gameId={gameId} />
      </main>
    </GameProvider>
  );
}
