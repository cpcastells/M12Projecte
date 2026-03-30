export const VALIDATION_ERRORS = {
  email: {
    required: "El correu electrònic és obligatori",
    invalid: "El format del correu electrònic no és vàlid",
  },
  password: {
    required: "La contrasenya és obligatòria",
    minLength: "La contrasenya ha de tenir mínim 6 caràcters",
    uppercase: "La contrasenya ha de contenir almenys una majúscula",
    number: "La contrasenya ha de contenir almenys un número",
  },
  username: {
    required: "El nom d'usuari és obligatori",
    minLength: "El nom d'usuari ha de tenir mínim 3 caràcters",
  },
} as const;
