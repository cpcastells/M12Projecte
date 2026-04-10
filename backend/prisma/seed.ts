import { prisma } from "../src/db/prisma";

async function main() {
  // Crear les 3 sales
  const room1 = await prisma.room.upsert({
    where: { code: "01" },
    update: {},
    create: {
      code: "01",
      name: "Sala 01 — Mòdul de Comunicacions",
      description:
        "El mòdul de comunicacions de l'estació Hadal-7. Les pantalles parpellegen amb dades corruptes.",
      isInitial: true,
    },
  });

  const room2 = await prisma.room.upsert({
    where: { code: "02" },
    update: {},
    create: {
      code: "02",
      name: "Sala 02 — Laboratori Central",
      description:
        "El laboratori central on es processen les mostres de les profunditats. Alguna cosa ha anat molt malament aquí.",
      isInitial: false,
    },
  });

  const room3 = await prisma.room.upsert({
    where: { code: "03" },
    update: {},
    create: {
      code: "03",
      name: "Sala 03 — Nucli de l'IA",
      description:
        "El cor de l'Abyss AI. Els servidors emeten un brunzit inquietant.",
      isInitial: false,
    },
  });

  // Crear objectes interactius per cada sala
  await prisma.interactiveObject.createMany({
    skipDuplicates: true,
    data: [
      // Sala 1
      {
        roomId: room1.id,
        name: "Terminal",
        description:
          "Terminal A mostra registres amb anomalies. Valor destacat: DEPTH = 4200",
        type: "terminal",
      },
      {
        roomId: room1.id,
        name: "Panel",
        description:
          "Panell amb sistemes crítics. Oxigen baix i energia limitada.",
        type: "panel",
      },
      {
        roomId: room1.id,
        name: "Door",
        description: "Porta bloquejada. Necessites un codi de 4 dígits.",
        type: "door",
      },
      // Sala 2
      {
        roomId: room2.id,
        name: "Terminal",
        description:
          "Pantalla del laboratori amb resultats d'anàlisi. Una mostra etiquetada: SPECIMEN-7B.",
        type: "terminal",
      },
      {
        roomId: room2.id,
        name: "Panel",
        description:
          "Panel de control ambiental. Temperatura: -2°C. Pressió anòmala detectada.",
        type: "panel",
      },
      {
        roomId: room2.id,
        name: "Door",
        description: "Porta blindada amb accés restringit al nucli de l'IA.",
        type: "door",
      },
      // Sala 3
      {
        roomId: room3.id,
        name: "Terminal",
        description:
          "Interfície directa amb l'Abyss AI. El cursor parpelleja esperant una comanda.",
        type: "terminal",
      },
      {
        roomId: room3.id,
        name: "Panel",
        description:
          "Servidors principals. Un d'ells mostra: OVERRIDE SEQUENCE REQUIRED.",
        type: "panel",
      },
      {
        roomId: room3.id,
        name: "Door",
        description: "Sortida d'emergència cap a la superfície.",
        type: "door",
      },
    ],
  });

  // Crear puzzles per cada sala
  await prisma.puzzle.upsert({
    where: { roomId: room1.id },
    update: {},
    create: {
      roomId: room1.id,
      title: "Enigma",
      statement: "Introdueix el codi de profunditat de l'estació.",
      solution: "4200",
    },
  });

  await prisma.puzzle.upsert({
    where: { roomId: room2.id },
    update: {},
    create: {
      roomId: room2.id,
      title: "Enigma",
      statement:
        "Quina és la identificació de la mostra anòmala del laboratori?",
      solution: "7B",
    },
  });

  await prisma.puzzle.upsert({
    where: { roomId: room3.id },
    update: {},
    create: {
      roomId: room3.id,
      title: "Enigma",
      statement: "Escriu la comanda per desactivar la quarantena de l'IA.",
      solution: "OVERRIDE",
    },
  });

  console.log("Seed completat: 3 sales, objectes i puzzles creats.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
