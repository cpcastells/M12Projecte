import { Request, Response } from "express";
import { hashPassword } from "../utils/password";
// import { comparePassword } from "../utils/password";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const hasUppercase = /[A-Z]/;
const hasNumber = /\d/;

export async function login(req: Request, res: Response) {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({
      message: "El correu electrònic i la contrasenya són obligatoris",
    });
  }

  // TODO (#66): buscar usuari a BD (Prisma)
  // TODO (#65): comparar password amb bcrypt
  // const ok = await comparePassword(password, user.passwordHash);
  // TODO (#56): generar JWT i retornar-lo

  return res.status(200).json({ message: "Endpoint de login OK" });
}

export async function register(req: Request, res: Response) {
  const { email, password, username } = req.body ?? {};

  // required
  if (!email || !password || !username) {
    return res.status(400).json({
      message:
        "El correu electrònic, la contrasenya i el nom d'usuari són obligatoris",
    });
  }

  // email format
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "El format del correu electrònic no és vàlid" });
  }

  // password min length (6 segons frontend)
  if (typeof password !== "string" || password.length < 6) {
    return res
      .status(400)
      .json({ message: "La contrasenya ha de tenir com a mínim 6 caràcters" });
  }

  // password uppercase
  if (!hasUppercase.test(password)) {
    return res.status(400).json({
      message: "La contrasenya ha de contenir almenys una lletra majúscula",
    });
  }

  // password number
  if (!hasNumber.test(password)) {
    return res
      .status(400)
      .json({ message: "La contrasenya ha de contenir almenys un número" });
  }

  // (#65): bcrypt
  const passwordHash = await hashPassword(password);

  // TODO (#66): guardar usuari a BD amb Prisma utilitzant passwordHash

  return res.status(201).json({
    message: "Endpoint de registre OK",
    user: { email, username },
  });
}
