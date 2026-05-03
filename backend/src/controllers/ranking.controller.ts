import type { Request, Response } from "express";
import { getRankingUseCase } from "../usecases/getRanking.usecase";

export async function getRanking(req: Request, res: Response) {
  try {
    const limitRaw = req.query.limit;
    const limit =
      typeof limitRaw === "string" && !isNaN(Number(limitRaw))
        ? Number(limitRaw)
        : undefined;

    const result = await getRankingUseCase(limit);

    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error("Error in getRanking controller:", error);

    return res.status(500).json({
      message: "Error obtenint el rànquing",
    });
  }
}
