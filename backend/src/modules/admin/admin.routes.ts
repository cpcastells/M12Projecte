import { Router } from "express";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/rooms", adminController.getRooms);
router.get("/rooms/:id", adminController.getRoomById);
router.patch("/rooms/:id", adminController.updateRoom);
router.patch("/puzzles/:id", adminController.updatePuzzle);

export default router;
