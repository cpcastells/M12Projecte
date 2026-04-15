import { Request, Response } from "express";
import { adminService } from "./admin.service";

export const adminController = {
  async getRooms(req: Request, res: Response) {
    try {
      const rooms = await adminService.getRooms();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ error: "Error fetching rooms" });
    }
  },

  async getRoomById(req: Request<{ id: string }>, res: Response) {
    try {
      const id = req.params.id;

      const room = await adminService.getRoomById(id);

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      res.json(room);
    } catch (error) {
      res.status(400).json({ error: "Invalid room ID" });
    }
  },

  async updateRoom(req: Request<{ id: string }>, res: Response) {
    try {
      const idParam = req.params.id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;

      if (!id) {
        return res.status(400).json({ error: "ID requerido" });
      }

      const updated = await adminService.updateRoom(id, req.body);
      return res.json(updated);
    } catch (error) {
      res.status(400).json({ error: "Error updating room" });
    }
  },

  async updatePuzzle(req: Request<{ id: string }>, res: Response) {
    try {
      const idParam = req.params.id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;

      if (!id) {
        return res.status(400).json({ error: "ID requerido" });
      }

      const updated = await adminService.updatePuzzle(id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: "Error updating puzzle" });
    }
  },
};
