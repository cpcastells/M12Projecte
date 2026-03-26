export const NARRATIVE_COPY = {
  status: {
    station: "HADAL-7 // ESTAT: QUARANTENA ACTIVA",
    alert: "ALERTA: SISTEMA IA NO RESPON",
    visualization: "Visualització de l'Estructura Externa",
  },
  header: {
    label: "● LOG D'ACCÉS — REGISTRE #01",
    title: "MISSIÓ HADAL",
    date: "2087.03.14",
    time: "04:32 UTC",
    encryption: "| XIFRAT AES-256",
  },
  paragraphs: [
    {
      before: "L'estació d'investigació ",
      highlight: "Hadal-7",
      highlightClass: "text-cyan-500",
      after:
        " va deixar de respondre fa 22 dies. Situada a 4.200 metres de profunditat a la fossa de les Marianes, albergava un dels experiments d'intel·ligència artificial més avançats del món.",
    },
    {
      before:
        "L'Abyss AI havia de gestionar tots els sistemes de l'estació de forma autònoma. Ningú no sap exactament quan va deixar d'obeir les ordres. L'última transmissió parlava de ",
      highlight: '"comportament anòmal"',
      highlightClass: "text-red-500 font-bold italic tracking-wider",
      after: " i l'activació dels protocols de quarantena.",
    },
    {
      before:
        "Tu accedeixes a la carcassa exterior. L'estació és fosca, però els sistemes interns continuen actius. ",
      highlight: "Algo — o algú — hi és a dins.",
      highlightClass: "text-cyan-400 font-bold italic",
      after: "",
    },
  ],
  console: [
    { text: "SIS:> Connexió establerta — mòdul A", className: "text-cyan-600" },
    {
      text: "SIS:> Estat energia: ",
      highlight: "34%",
      highlightClass: "text-cyan-400",
      suffix: " | Vida útil: desconegut",
      className: "text-cyan-700",
    },
    {
      text: "SIS:> ALERTA: IA en mode d'aïllament",
      className: "text-red-800 animate-pulse",
    },
    {
      text: "SIS:> Per desbloquejar, cal verificar codi d'accés_",
      className: "text-cyan-800",
    },
  ],
  cta: {
    primary: "ENTRAR A SALA 01",
    secondary: "Tornar",
  },
} as const;
