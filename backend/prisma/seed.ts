import { createHash } from "crypto";
import { prisma } from "../src/db/prisma";

type SeedRoom = {
  code: string;
  name: string;
  description: string;
  image?: string | null;
  order: number;
  isInitial: boolean;
  idlePhrases: string[];
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
    image: "/img/rooms/sistema-central.webp",
    order: 1,
    isInitial: true,
    idlePhrases: [
      "Monitorització activa. Ajuda no contemplada.",
      "El sistema confirma: ets prescindible.",
      "Procés òptim. Resultat incert.",
      "Les estadístiques no juguen al teu favor.",
      "Protocols complets. Empatia no instal·lada.",
      "El sistema funciona correctament. La situació no.",
      "Els errors humans són estadísticament previsibles.",
      "S’han detectat decisions qüestionables.",
      "El control central no sent pressa.",
      "Simulació estable. Usuari en risc.",
      "Accés detectat. Motivació desconeguda.",
      "El sistema observa, però no intervé.",
      "Estat estable. Per ara.",
      "Les decisions tenen conseqüències mesurables.",
      "Les dades no menteixen. Les interpretacions sí.",
      "No totes les ordres són recomanables.",
      "El control és una il·lusió necessària.",
      "El sistema no oblida.",
      "Accions repetides incrementen el marge d’error.",
      "Cap decisió és realment neutra.",
    ],
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
          text: "Hi ha una relació proporcional entre pressió i profunditat.",
        },
        {
          order: 3,
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
    image: "/img/rooms/laboratori.webp",
    order: 2,
    isInitial: false,
    idlePhrases: [
      "Resultat inconclús. Com gairebé sempre.",
      "Les mostres no han sobreviscut. Documentació completada.",
      "L’experiment ha fallat amb èxit.",
      "La recerca requereix sacrificis. Preferiblement teus.",
      "Error detectat. Solució no garantida.",
      "Alguns resultats no es poden desfer.",
      "La teoria era correcta. La pràctica no tant.",
      "Les dades indiquen optimisme irresponsable.",
      "Protocols seguits. Conseqüències inevitables.",
      "El laboratori no formula disculpes.",
      "Hipòtesi descartada. De moment.",
      "L’error forma part del procés.",
      "No tots els experiments acaben bé.",
      "Resultats parcials poden ser enganyosos.",
      "La ciència no promet respostes ràpides.",
      "Substància analitzada. Risc no quantificat.",
      "Més dades no sempre signifiquen més claredat.",
      "Error humà possible. Sistema no exempt.",
      "El laboratori aprèn dels seus errors.",
      "La recerca continua, amb o sense tu.",
    ],
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
    image: "/img/rooms/sortida.webp",
    order: 3,
    isInitial: false,
    idlePhrases: [
      "Evacuació disponible. Resultat no garantit.",
      "Aquesta és l’opció recomanada. Les altres són pitjors.",
      "Sortida confirmada. Esperem que sigui la correcta.",
      "El temps restant és insuficient. Com sempre.",
      "Algunes decisions arriben massa tard per ser bones.",
      "El protocol d’evacuació no inclou tranquil·litat.",
      "Si has arribat fins aquí, estadísticament ja has guanyat alguna cosa.",
      "L’èxit encara és possible. Poc probable, però possible.",
      "El sistema ha calculat múltiples finals. Cap ideal.",
      "Evacuar no implica necessàriament sobreviure.",
      "Última seqüència activa. No recomanem dubtar ara.",
      "El sistema no pot assegurar un final satisfactori.",
      "Aquesta acció serà recordada. Si algú la revisa.",
      "El mòdul d’evacuació funciona. La resta és incertesa.",
      "Has pres moltes decisions fins aquí. Aquesta també compta.",
      "El temps s’està acabant. El sistema no sent pressa.",
      "Si el pla falla, el protocol s’actualitzarà… massa tard.",
      "El sistema et desitja sort. No en pot oferir més.",
      "Aquest és el final del procés. No necessàriament del problema.",
      "Transmissió finalitzada. Bona sort… la necessitaràs.",
    ],
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

// Hash dels camps que, si canvien, trenquen partides en curs.
function computeStructuralHash(rooms: SeedRoom[]): string {
  const structural = rooms.map((r) => ({
    code: r.code,
    order: r.order,
    isInitial: r.isInitial,
    puzzle: {
      solution: r.puzzle.solution,
      reward: r.puzzle.reward ?? null,
    },
    hints: r.puzzle.hints
      .map((h) => ({ order: h.order }))
      .sort((a, b) => a.order - b.order),
    objects: r.objects
      .map((o) => ({
        name: o.name,
        type: o.type,
        isInteractive: o.isInteractive ?? true,
        action: o.action ?? null,
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  }));
  structural.sort((a, b) => a.code.localeCompare(b.code));
  return createHash("sha256").update(JSON.stringify(structural)).digest("hex");
}

// Hash de tot el contingut (estructural + cosmètic). Si canvia qualsevol camp
// —imatges, textos, descripcions...— cal reaplicar upserts, però sense tocar partides.
function computeContentHash(rooms: SeedRoom[]): string {
  const sorted = [...rooms].sort((a, b) => a.code.localeCompare(b.code));
  return createHash("sha256").update(JSON.stringify(sorted)).digest("hex");
}

async function main() {
  console.log("🌱 Seeding escape room...");

  const structuralHash = computeStructuralHash(ROOMS);
  const contentHash = computeContentHash(ROOMS);
  const existing = await prisma.seedMeta.findUnique({ where: { id: 1 } });

  if (existing && existing.contentHash === contentHash) {
    console.log("Seed up-to-date, skipping.");
    return;
  }

  const structuralChanged =
    !existing || existing.structuralHash !== structuralHash;

  if (!existing) {
    console.log("First seed run, initializing.");
  } else if (structuralChanged) {
    console.log(
      "Structural change detected, reseeding (partides seran esborrades).",
    );
  } else {
    console.log(
      "Cosmetic change detected, refreshing content (partides intactes).",
    );
  }

  if (structuralChanged) {
    await prisma.game.deleteMany();
  }

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
        idlePhrases: r.idlePhrases,
      },
      create: {
        code: r.code,
        name: r.name,
        description: r.description,
        image: r.image ?? null,
        order: r.order,
        isInitial: r.isInitial,
        idlePhrases: r.idlePhrases,
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

  await prisma.seedMeta.upsert({
    where: { id: 1 },
    update: { structuralHash, contentHash },
    create: { id: 1, structuralHash, contentHash },
  });

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
