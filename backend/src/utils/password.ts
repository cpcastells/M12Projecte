import bcrypt from "bcrypt";

/**
 * Nombre de rondes de salting per bcrypt.
 * Un valor de 10 és un bon equilibri entre seguretat i rendiment
 * per a entorns de desenvolupament i producció.
 */
const SALT_ROUNDS = 10;

/**
 * Genera el hash d'una contrasenya en text pla utilitzant bcrypt.
 *
 * @param plainPassword - Contrasenya en text pla introduïda per l'usuari
 * @returns Hash segur de la contrasenya (inclou el salt internament)
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Compara una contrasenya en text pla amb el seu hash emmagatzemat.
 * S'utilitza durant el procés de login.
 *
 * @param plainPassword - Contrasenya introduïda per l'usuari
 * @param passwordHash - Hash de la contrasenya guardat a la base de dades
 * @returns true si la contrasenya coincideix, false en cas contrari
 */
export async function comparePassword(
  plainPassword: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, passwordHash);
}
