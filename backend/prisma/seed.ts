import { prisma } from "../src/db/prisma";

type SeedRoom = {
  code: string;
  name: string;
  description: string;
  image?: string | null;
  order: number;
  isInitial: boolean;
  puzzle: {
    title: string;
    statement: string;
    solution: string;
    reward?: string | null;
    hints: { order: number; text: string }[];
  };
  objects: {
    name: string;
    description: string;
    type: string;
    isInteractive?: boolean;
    isVisible?: boolean;
    action?: string | null;
  }[];
};

const ROOMS: SeedRoom[] = [
  /**
   * ===== SALA 1- SISTEMA CENTRAL =====
   */

  {
    code: "ROOM_1",
    name: "Sistema Central",
    description: "Sala de control del sistema central de l’estació submarina.",
    image: "/img/rooms/sistema-central.jpg",
    order: 1,
    isInitial: true,
    puzzle: {
      title: "Enigma Principal: Activació del Sistema Central",
      statement:
        "Com a enginyer de l'estació submarina, has de resoldre l'enigma per activar el sistema central. Explora la sala, interactua amb els objectes per deduir pistes claus i troba el codi de 4 dígits correcte basat en la profunditat operativa.",
      solution: "4200",
      reward: "EXTRA_SCORE",
      hints: [
        {
          order: 1,
          text: "Relaciona la informació dels diferents objectes de la sala.",
        },
        {
          order: 2,
          text: "La pressió pot donar-te una pista sobre la profunditat.",
        },
        {
          order: 3,
          text: "Hi ha una relació proporcional entre pressió i profunditat.",
        },
        {
          order: 4,
          text: "Multiplica la pressió per 10 per obtenir el valor final.",
        },
      ],
    },
    objects: [
      {
        name: "Terminal A",
        description: "Terminal per introduir el codi del sistema central.",
        type: "terminal",
        isInteractive: true,
        isVisible: true,
        action: "SUBMIT_CODE",
      },
      {
        name: "Panell de Control",
        description:
          "Mostra dades del sistema: pressió estabilitzada a 420 atmosferes.",
        type: "panel",
        isInteractive: true,
        isVisible: true,
        action: "INSPECT",
      },
      {
        name: "Llibreta de Bitàcora",
        description:
          "Registre tècnic: la profunditat operativa segura es troba entre 4000 i 4500 metres.",
        type: "logbook",
        isInteractive: true,
        isVisible: true,
        action: "READ_LOG",
      },
    ],
  },

  /**
   * ===== SALA 2 - LABORATORI =====
   */
  {
    code: "ROOM_2",
    name: "Laboratori de Recerca",
    description:
      "Laboratori científic de l’estació on s’analitzaven mostres biològiques.",
    image: "/img/rooms/laboratori.jpg",
    order: 2,
    isInitial: false,
    puzzle: {
      title: "Anàlisi de mostres",
      statement:
        "Identifica la mostra correcta per desbloquejar el següent accés.",
      solution: "OXIGEN",
      reward: "TIME_BONUS",
      hints: [
        {
          order: 1,
          text: "Les mostres estan etiquetades segons la seva composició.",
        },
        {
          order: 2,
          text: "La supervivència depèn d’un element essencial.",
        },
        {
          order: 3,
          text: "És el gas que respirem.",
        },
      ],
    },
    objects: [
      {
        name: "Microscopi",
        description: "Permet analitzar una mostra i obtenir una pista.",
        type: "microscope",
        isInteractive: true,
        isVisible: true,
        action: "SHOW_HINT",
      },
      {
        name: "Tub d’assaig",
        description: "Conté una mostra amb etiqueta parcial.",
        type: "test-tube",
        isInteractive: true,
        isVisible: true,
        action: "READ_LABEL",
      },
      {
        name: "Taula de laboratori",
        description: "Superfície plena d’instruments (decoratiu).",
        type: "table",
        isInteractive: false,
        isVisible: true,
        action: null,
      },
    ],
  },

  /**
   * ===== SALA 3 - SORTIDA =====
   * Mòdul d’evacuació / porta final.
   */
  {
    code: "ROOM_3",
    name: "Mòdul d’Evacuació",
    description:
      "Última cambra abans de la sortida. Només falta validar la clau final.",
    image: "/img/rooms/sortida.jpg",
    order: 3,
    isInitial: false,
    puzzle: {
      title: "Desbloqueig final",
      statement: "Introdueix la paraula clau per obrir la porta de sortida.",
      solution: "ABYSS",
      reward: "FINAL_SCORE_BONUS",
      hints: [
        { order: 1, text: "La clau final està relacionada amb el projecte." },
        { order: 2, text: "Comença per A..." },
        { order: 3, text: "És una paraula curta." },
      ],
    },
    objects: [
      {
        name: "Panell Final",
        description: "Panell per validar la paraula clau final.",
        type: "panel",
        isInteractive: true,
        isVisible: true,
        action: "SUBMIT_FINAL",
      },
      {
        name: "Porta de Sortida",
        description: "Porta segellada. S’obrirà quan el codi sigui correcte.",
        type: "door",
        isInteractive: false,
        isVisible: true,
        action: null,
      },
      {
        name: "Kit d’emergència",
        description: "Un kit amb una nota d’última hora (pista).",
        type: "kit",
        isInteractive: true,
        isVisible: true,
        action: "SHOW_HINT",
      },
    ],
  },
];

async function main() {
  console.log("🌱 Seeding escape room...");

  // Esborrar partides per evitar inconsistències si canvia el contingut
  await prisma.game.deleteMany();

  // Per cada sala: upsert sala + upsert puzzle + recrear hints/objects
  for (const r of ROOMS) {
    const room = await prisma.room.upsert({
      where: { code: r.code },
      update: {
        name: r.name,
        description: r.description,
        image: r.image ?? null,
        order: r.order,
        isInitial: r.isInitial,
      },
      create: {
        code: r.code,
        name: r.name,
        description: r.description,
        image: r.image ?? null,
        order: r.order,
        isInitial: r.isInitial,
      },
    });

    const puzzle = await prisma.puzzle.upsert({
      where: { roomId: room.id }, // roomId és unique
      update: {
        title: r.puzzle.title,
        statement: r.puzzle.statement,
        solution: r.puzzle.solution,
        reward: r.puzzle.reward ?? null,
      },
      create: {
        roomId: room.id,
        title: r.puzzle.title,
        statement: r.puzzle.statement,
        solution: r.puzzle.solution,
        reward: r.puzzle.reward ?? null,
      },
    });

    // Hints: recreem sempre
    await prisma.hint.deleteMany({ where: { puzzleId: puzzle.id } });
    if (r.puzzle.hints.length > 0) {
      await prisma.hint.createMany({
        data: r.puzzle.hints.map((h) => ({
          puzzleId: puzzle.id,
          order: h.order,
          text: h.text,
        })),
      });
    }

    // Objects: recreem sempre i garantim 3 per sala
    await prisma.interactiveObject.deleteMany({ where: { roomId: room.id } });

    if (r.objects.length !== 3) {
      throw new Error(
        `La sala ${r.code} ha de tenir EXACTAMENT 3 objectes. Ara en té ${r.objects.length}.`,
      );
    }

    await prisma.interactiveObject.createMany({
      data: r.objects.map((o) => ({
        roomId: room.id,
        name: o.name,
        description: o.description,
        type: o.type,
        isInteractive: o.isInteractive ?? true,
        isVisible: o.isVisible ?? true,
        action: o.action ?? null,
      })),
    });

    console.log(`Seeded ${room.code} (order ${room.order})`);
  }

  console.log("Seed completat!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
