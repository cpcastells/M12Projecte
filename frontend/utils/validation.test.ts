import { VALIDATION_ERRORS } from "@/constants/copy/validation";
import { validateEmail, validatePassword } from "./validation";

describe("Donada la funció validateEmail", () => {
  test("retorna error si el valor és buit", () => {
    expect(validateEmail("")).toBe(VALIDATION_ERRORS.email.required);
  });

  test("retorna error si el format és invàlid", () => {
    expect(validateEmail("noarroba")).toBe(VALIDATION_ERRORS.email.invalid);
    expect(validateEmail("sense@domini")).toBe(VALIDATION_ERRORS.email.invalid);
    expect(validateEmail("@sense-local.com")).toBe(
      VALIDATION_ERRORS.email.invalid,
    );
  });

  test("retorna null si el format és vàlid", () => {
    expect(validateEmail("usuari@domini.com")).toBeNull();
    expect(validateEmail("test@sub.domini.cat")).toBeNull();
  });
});

describe("Donada la funció validatePassword", () => {
  test("retorna error si el valor és buit", () => {
    expect(validatePassword("")).toBe(VALIDATION_ERRORS.password.required);
  });

  test("retorna error si té menys de 6 caràcters", () => {
    expect(validatePassword("Ab1")).toBe(VALIDATION_ERRORS.password.minLength);
  });

  test("retorna error si no conté majúscula", () => {
    expect(validatePassword("abcdef1")).toBe(
      VALIDATION_ERRORS.password.uppercase,
    );
  });

  test("retorna error si no conté número", () => {
    expect(validatePassword("Abcdef")).toBe(VALIDATION_ERRORS.password.number);
  });

  test("retorna null si compleix tots els requisits", () => {
    expect(validatePassword("Abcdef1")).toBeNull();
    expect(validatePassword("Password123")).toBeNull();
  });
});
