import { Server } from "socket.io";
import {
  getUpdatedGameTimer,
  persistGameTimer,
} from "../services/timer.service";

export function registerGameTimerSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    let currentInterval: ReturnType<typeof setInterval> | null = null;
    let currentGameId: number | null = null;
    let currentTimeRemainingSeconds: number | null = null;

    const clearCurrentTimer = async () => {
      if (currentInterval) {
        clearInterval(currentInterval);
        currentInterval = null;
      }

      if (currentGameId && currentTimeRemainingSeconds !== null) {
        await persistGameTimer(currentGameId, currentTimeRemainingSeconds);
      }
    };

    socket.on("timer:join", async ({ gameId }) => {
      try {
        const numericGameId = Number(gameId);

        if (!numericGameId) {
          socket.emit("timer:error", { message: "Invalid gameId" });
          return;
        }

        await clearCurrentTimer();

        currentGameId = numericGameId;

        socket.join(`game:${numericGameId}`);

        const timer = await getUpdatedGameTimer(numericGameId);

        currentTimeRemainingSeconds = timer.timeRemainingSeconds;
        let lastPersistedAt = Date.now();

        socket.emit("timer:update", {
          gameId: numericGameId,
          timeRemainingSeconds: currentTimeRemainingSeconds,
        });

        currentInterval = setInterval(async () => {
          if (currentTimeRemainingSeconds === null) return;

          currentTimeRemainingSeconds = Math.max(
            0,
            currentTimeRemainingSeconds - 1,
          );

          io.to(`game:${numericGameId}`).emit("timer:update", {
            gameId: numericGameId,
            timeRemainingSeconds: currentTimeRemainingSeconds,
          });

          const shouldPersist =
            Date.now() - lastPersistedAt >= 15000 ||
            currentTimeRemainingSeconds === 0;

          if (shouldPersist) {
            await persistGameTimer(numericGameId, currentTimeRemainingSeconds);
            lastPersistedAt = Date.now();
          }

          if (currentTimeRemainingSeconds === 0) {
            io.to(`game:${numericGameId}`).emit("timer:ended", {
              gameId: numericGameId,
              reason: "timeExpired",
            });

            if (currentInterval) {
              clearInterval(currentInterval);
              currentInterval = null;
            }
          }
        }, 1000);
      } catch (error) {
        console.error("Timer socket error:", error);

        socket.emit("timer:error", {
          message: "Could not load timer",
        });
      }
    });

    socket.on("timer:leave", async ({ gameId }) => {
      const numericGameId = Number(gameId);

      if (!numericGameId) return;

      socket.leave(`game:${numericGameId}`);

      if (currentGameId === numericGameId) {
        await clearCurrentTimer();
        currentGameId = null;
        currentTimeRemainingSeconds = null;
      }

      console.log(`Client left game ${numericGameId}`);
    });

    socket.on("disconnect", async () => {
      await clearCurrentTimer();
      console.log("Client disconnected:", socket.id);
    });
  });
}
