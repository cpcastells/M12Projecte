import type { Request, Response } from "express";
import {
  getUserStatsUseCase,
  deriveRank,
} from "../usecases/getUserStats.usecase";

export async function getMyProfile(req: Request, res: Response) {
  try {
    // Ruta protegida pel middleware authenticate. Dades bàsiques
    const userId = Number(req.user!.id);
    const { username, email } = req.user!;

    const stats = await getUserStatsUseCase(userId);
    const rank = deriveRank(stats.completionRate);

    return res.status(200).json({
      user: { username, email, rank },
      stats,
    });
  } catch (error) {
    console.error("PROFILE_ME ERROR →", error);
    return res.status(500).json({ message: "Error obtenint el perfil" });
  }
}
