import { Server } from "socket.io";
import {
  getUpdatedGameTimer,
  persistGameTimer,
} from "../services/timer.service";

export function registerGameTimerSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("timer:join", async ({ gameId }) => {
      try {
        const numericGameId = Number(gameId);

        if (!numericGameId) {
          socket.emit("timer:error", { message: "Invalid gameId" });
          return;
        }

        socket.join(`game:${numericGameId}`);

        // 🔹 SOLO UNA VEZ: leer BD
        const timer = await getUpdatedGameTimer(numericGameId);

        let timeRemainingSeconds = timer.timeRemainingSeconds;
        let lastPersistedAt = Date.now();

        // Enviamos primer valor
        socket.emit("timer:update", {
          gameId: numericGameId,
          timeRemainingSeconds,
        });

        const interval = setInterval(async () => {
          // 🔹 cálculo en memoria (NO BD)
          timeRemainingSeconds = Math.max(0, timeRemainingSeconds - 1);

          io.to(`game:${numericGameId}`).emit("timer:update", {
            gameId: numericGameId,
            timeRemainingSeconds,
          });

          // 🔹 guardar cada 15s o al terminar
          const shouldPersist =
            Date.now() - lastPersistedAt >= 15000 || timeRemainingSeconds === 0;

          if (shouldPersist) {
            await persistGameTimer(numericGameId, timeRemainingSeconds);
            lastPersistedAt = Date.now();
          }

          // 🔹 finalizar
          if (timeRemainingSeconds === 0) {
            io.to(`game:${numericGameId}`).emit("timer:ended", {
              gameId: numericGameId,
              reason: "timeExpired",
            });

            clearInterval(interval);
          }
        }, 1000);

        socket.on("disconnect", async () => {
          clearInterval(interval);

          // 🔹 guardar estado al salir
          await persistGameTimer(numericGameId, timeRemainingSeconds);

          console.log("Client disconnected:", socket.id);
        });
      } catch (error) {
        console.error("Timer socket error:", error);

        socket.emit("timer:error", {
          message: "Could not load timer",
        });
      }
    });
  });
}
