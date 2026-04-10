import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { getRoom } from "../controllers/room.controller";

const router = Router();

router.get("/:id", authenticate, getRoom);

export default router;
