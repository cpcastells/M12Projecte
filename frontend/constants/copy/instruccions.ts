export const INSTRUCTIONS_COPY = {
  title: "PROTOCOL D'OPERACIÓ",
  subtitle:
    "Benvingut, agent. Llegeix atentament les instruccions de missió abans d'accedir a l'estació.",

  steps: [
    {
      num: "01",
      title: "Explora",
      desc: "Fes clic sobre els elements de la sala per examinar-los. Cada objecte pot contenir una pista, un codi o informació crítica.",
    },
    {
      num: "02",
      title: "Llegeix les pistes",
      desc: "El panell dret mostra el detall dels objectes i les pistes recollides. Analitza amb cura.",
    },
    {
      num: "03",
      title: "Resol l'enigma",
      desc: "Cada sala té un enigma central. Introdueix la resposta al camp de text.",
    },
    {
      num: "04",
      title: "Avança",
      desc: "En resoldre l'enigma, s'obre la porta següent. El progrés es desa automàticament.",
    },
  ],

  alert:
    " AVÍS DE MISSIÓ: L'estació està en quarantena. Tens temps limitat per sala. No cometis errors.",

  controls: [
    "Clic esquerre sobre un objecte  → Examinar",
    "Camp de text + ENTER → Enviar resposta",
    "Icona de disc + Guardar → Progrés manual",
    "ESC Menu principal(la partida es desa) → Sortir",
  ],

  cta: {
      secondary: "Tornar a l'inici",
  },
};
