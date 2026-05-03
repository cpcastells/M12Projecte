import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import authRouter from "./routes/auth.routes";
import gameRouter from "./routes/game.routes";
import profileRoutes from "./routes/profile.routes";
import adminRoutes from "./routes/admin.routes";
import { registerGameTimerSocket } from "./sockets/gameTimer.socket";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  }),
);
app.use(express.json());
app.use("/auth", authRouter);
app.use("/game", gameRouter);
app.use("/profile", profileRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 3001;
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  },
});

registerGameTimerSocket(io);

httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
