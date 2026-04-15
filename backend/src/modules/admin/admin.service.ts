import { prisma } from "../../db/prisma";

// Helper para convertir y validar IDs
function parseId(id: string): number {
  const parsed = Number(id);

  if (isNaN(parsed)) {
    throw new Error("Invalid ID");
  }

  return parsed;
}

export const adminService = {
  // 🔹 Obtener todas las salas
  async getRooms() {
    return prisma.room.findMany({
      include: {
        puzzle: true,
      },
      orderBy: { order: "asc" },
    });
  },

  // 🔹 Obtener una sala por ID
  async getRoomById(id: string) {
    const roomId = parseId(id);

    return prisma.room.findUnique({
      where: { id: roomId },
      include: {
        puzzle: {
          include: {
            hints: true,
          },
        },
      },
    });
  },

  // 🔹 Actualitzar sala
  async updateRoom(id: string, data: any) {
    const roomId = parseId(id);

    return prisma.room.update({
      where: { id: roomId },
      data: {
        name: data.name,
        description: data.description,
        order: data.order,
        image: data.image,
      },
    });
  },

  // 🔹 Actualitzar puzzle
  async updatePuzzle(id: string, data: any) {
    const puzzleId = parseId(id);

    return prisma.puzzle.update({
      where: { id: puzzleId },
      data: {
        title: data.title,
        statement: data.statement,
        solution: data.solution,
        reward: data.reward,
      },
    });
  },
};
