import { Request, Response } from "express";
import { hashPassword, comparePassword } from "../utils/password";
import { prisma } from "../db/prisma";
import { signToken } from "../utils/jwt";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const hasUppercase = /[A-Z]/;
const hasNumber = /\d/;

// Login
export async function login(req: Request, res: Response) {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({
      message: "El correu electrònic i la contrasenya són obligatoris",
    });
  }

  // Normalització (abans del regex)
  const normalizedEmail = String(email).trim().toLowerCase();
  const passwordStr = String(password);

  // Validació de format d'email (coherent amb register)
  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({
      message: "El format del correu electrònic no és vàlid",
    });
  }

  try {
    // (#66): Buscar usuari a BD (Prisma)
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        passwordHash: true,
      },
    });

    // No donar info si l'email existeix o no
    if (!user) {
      return res.status(401).json({ message: "Credencials incorrectes" });
    }

    // (#65): Comparar password amb bcrypt
    const ok = await comparePassword(passwordStr, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Credencials incorrectes" });
    }

    // (#56): JWT
    const token = signToken({
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });
    return res.status(200).json({
      message: "Login correcte",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR →", err);
    return res.status(500).json({ message: "Error intern en fer login" });
  }
}

// Register
export async function register(req: Request, res: Response) {
  const { email, password, username } = req.body ?? {};

  // required
  if (!email || !password || !username) {
    return res.status(400).json({
      message:
        "El correu electrònic, la contrasenya i el nom d'usuari són obligatoris",
    });
  }

  // Normalització (abans de validar)
  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedUsername = String(username).trim();
  const passwordStr = String(password);

  // email format
  if (!emailRegex.test(normalizedEmail)) {
    return res
      .status(400)
      .json({ message: "El format del correu electrònic no és vàlid" });
  }

  // password min length (6 segons frontend)
  if (passwordStr.length < 6) {
    return res
      .status(400)
      .json({ message: "La contrasenya ha de tenir com a mínim 6 caràcters" });
  }

  // password uppercase
  if (!hasUppercase.test(passwordStr)) {
    return res.status(400).json({
      message: "La contrasenya ha de contenir almenys una lletra majúscula",
    });
  }

  // password number
  if (!hasNumber.test(passwordStr)) {
    return res
      .status(400)
      .json({ message: "La contrasenya ha de contenir almenys un número" });
  }

  // (#65): bcrypt
  const passwordHash = await hashPassword(password);

  try {
    // (#66): guardar usuari a BD amb Prisma utilitzant passwordHash
    const createdUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        username: normalizedUsername,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
    });

    return res.status(201).json({
      message: "Usuari registrat correctament",
      user: createdUser,
    });
  } catch (err: any) {
    // Duplicat (email o username únics): Prisma P2002 (violació de camp @unique)
    if (err?.code === "P2002") {
      return res.status(409).json({
        message: "El correu o el nom d'usuari ja existeix",
      });
    }

    // Error inesperat del servidor (no relacionat amb validacions ni duplicats)
    console.error("REGISTER ERROR →", err);
    return res.status(500).json({
      message: "Error intern en registrar l'usuari",
    });
  }
}
