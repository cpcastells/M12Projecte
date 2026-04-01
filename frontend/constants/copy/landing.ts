export const LANDING_COPY = {
  location: "PROFUNDITAT: 3.208 M — SECTOR ALFA",
  title: "ABYSS",
  titleAccent: "AI",
  subtitle: "Estació Submarina d'Investigació Profunda",
  narrative: [
    {
      before:
        "Any 2087. L'estació Hadal-7 porta tres setmanes en silenci de ràdio. L'última transmisió va mostrar ",
      highlight: "anomalies crítiques",
      after:
        " als sistemes d'IA. Tu ets l'únic agent d'evacuació que ha pogut accedir a la carcassa exterior.",
    },
    {
      before: "Navega pels compartiments, ",
      highlight: "desactiva la quarantena",
      after:
        " i descobreix per què l'Abyss AI ha tallat el contacte amb la superfície.",
    },
  ],
  ctaPrimary: "Iniciar Missió",
  ctaSecondary: [
    { label: "Instruccions", href: "/instruccions" },
    { label: "El meu perfil", href: "/profile" },
  ],
  stats: [
    { value: "3", label: "Sales", accent: false },
    { value: "7", label: "Enigmes", accent: false },
    { value: "~45'", label: "Durada Est.", accent: true },
    { value: "∞", label: "Misteri", accent: false },
  ],
} as const;
