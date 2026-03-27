import { Request, Response } from "express";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  // #55: de moment només comprovem que arriba el body
  // (bcrypt/prisma/jwt vindran en #65/#66/#56)
  return res.status(200).json({ message: "Login endpoint OK", email });
}
