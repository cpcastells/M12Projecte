import { VALIDATION_ERRORS } from "@/constants/copy/validation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateUsername = (value: string): string | null => {
  if (!value) return VALIDATION_ERRORS.username.required;
  if (value.length < 3) return VALIDATION_ERRORS.username.minLength;
  return null;
};

export const validateEmail = (value: string): string | null => {
  if (!value) return VALIDATION_ERRORS.email.required;
  if (!EMAIL_REGEX.test(value)) return VALIDATION_ERRORS.email.invalid;
  return null;
};

export const validatePassword = (value: string): string | null => {
  if (!value) return VALIDATION_ERRORS.password.required;
  if (value.length < 6) return VALIDATION_ERRORS.password.minLength;
  if (!/[A-Z]/.test(value)) return VALIDATION_ERRORS.password.uppercase;
  if (!/\d/.test(value)) return VALIDATION_ERRORS.password.number;
  return null;
};
