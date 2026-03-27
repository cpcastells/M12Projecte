import { Request, Response } from "express";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const hasUppercase = /[A-Z]/;
const hasNumber = /\d/;

export async function login(req: Request, res: Response) {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res
      .status(400)
      .json({
        message: "El correu electrònic i la contrasenya són obligatoris",
      });
  }

  // TODO (#66): buscar usuari a BD (Prisma)
  // TODO (#65): comparar password amb bcrypt
  // TODO (#56): generar JWT i retornar-lo
  return res.status(200).json({ message: "Endpoint de login OK", email });
}

export async function register(req: Request, res: Response) {
  const { email, password, name } = req.body ?? {};

  // required
  if (!email || !password) {
    return res
      .status(400)
      .json({
        message: "El correu electrònic i la contrasenya són obligatoris",
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
    return res
      .status(400)
      .json({
        message: "La contrasenya ha de contenir almenys una lletra majúscula",
      });
  }

  // password number
  if (!hasNumber.test(password)) {
    return res
      .status(400)
      .json({ message: "La contrasenya ha de contenir almenys un número" });
  }

  // TODO (#66): comprovar duplicat a BD
  // TODO (#65): bcrypt
  // TODO (#66): guardar usuari

  return res.status(201).json({
    message: "Endpoint de registre OK",
    user: { email, name },
  });
}
