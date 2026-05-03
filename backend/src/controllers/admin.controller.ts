import type { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { ROLES, type Role } from "../constants/roles";
import { getUserStatsUseCase } from "../usecases/getUserStats.usecase";

// GET /admin/users
export async function adminListUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
    });

    return res.status(200).json({ users });
  } catch (e) {
    return res.status(500).json({ message: "Error llistant usuaris" });
  }
}

/*GET /admin/users/:id/stats
  CANVI IMPORTANT (NOU ENDPOINT COMPLET)
  Afegit càlcul complet d’estadístiques del jugador
  Inclou games, endReason, rendiment i últimes partides*/
export async function adminGetUserStats(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ message: "ID d'usuari invàlid" });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, username: true, role: true },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuari no trobat" });
    }

    const stats = await getUserStatsUseCase(id);

    return res.status(200).json({ user, stats });
  } catch (e) {
    console.error("ADMIN_USER_STATS ERROR →", e);
    return res.status(500).json({ message: "Error obtenint estadístiques" });
  }
}

// PATCH /admin/users/:id/role
export async function adminUpdateUserRole(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { role } = req.body ?? {};

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ message: "ID d'usuari invàlid" });
    }

    if (role !== ROLES.USER && role !== ROLES.ADMIN) {
      return res.status(400).json({ message: "Rol invàlid" });
    }

    // Evitarem que un admin es modifiqui ell mateix el rol
    if (req.user?.id === id && role !== ROLES.ADMIN) {
      return res.status(400).json({
        message: "No pots modificar el rol tu mateix",
      });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role: role as Role },
      select: { id: true, email: true, username: true, role: true },
    });

    return res.status(200).json({ user: updated });
  } catch (e: any) {
    // Prisma: registre no existeix
    if (e?.code === "P2025") {
      return res.status(404).json({ message: "Usuari no trobat" });
    }
    return res.status(500).json({ message: "Error actualitzant rol" });
  }
}

// DELETE /admin/users/:id
export async function adminDeleteUser(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ message: "ID d'usuari invàlid" });
    }

    // Evitar auto-eliminació
    if (req.user?.id === id) {
      return res
        .status(400)
        .json({ message: "No pots eliminar-te a tu mateix" });
    }

    // Com que Game depèn de User, eliminem partides primer
    await prisma.game.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });

    return res.status(200).json({ message: "Usuari eliminat correctament" });
  } catch (e: any) {
    if (e?.code === "P2025") {
      return res.status(404).json({ message: "Usuari no trobat" });
    }
    return res.status(500).json({ message: "Error eliminant usuari" });
  }
}
// Admin list room + puzzles
export async function adminListRooms(req: Request, res: Response) {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { id: "asc" },
    });

    return res.status(200).json({ rooms });
  } catch (e) {
    return res.status(500).json({ message: "Error llistant sales" });
  }
}
export async function adminUpdateRoom(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const data = req.body;

    const room = await prisma.room.update({
      where: { id },
      data,
    });

    return res.status(200).json({ room });
  } catch {
    return res.status(500).json({ message: "Error actualitzant sala" });
  }
}
export async function adminListPuzzles(req: Request, res: Response) {
  try {
    const puzzles = await prisma.puzzle.findMany({
      orderBy: { id: "asc" },
    });

    return res.status(200).json({ puzzles });
  } catch {
    return res.status(500).json({ message: "Error llistant enigmes" });
  }
}
