import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes";
import gameRouter from "./routes/game.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/game", gameRouter);

app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
