export const LOGIN_COPY = {
  title: "Inicia Sessió",
  fields: { email: "Correu electrònic", password: "Contrasenya" },
  submit: "Entrar",
  switchPrompt: "No tens compte?",
  switchLink: "Registra't",
  switchHref: "/register",
} as const;

export const REGISTER_COPY = {
  title: "Registre",
  fields: { email: "Correu electrònic", password: "Contrasenya" },
  submit: "Registrar-se",
  switchPrompt: "Ja tens compte?",
  switchLink: "Inicia sessió",
  switchHref: "/login",
} as const;
