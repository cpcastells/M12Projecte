import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

export type JwtPayload = {
  sub: number; // user id
  email: string;
  role: string;
};

export function signToken(payload: JwtPayload) {
  const secret = process.env.TOKEN_SECRET;
  if (!secret) {
    throw new Error("TOKEN_SECRET no està definida");
  }

  const expiresIn = (process.env.TOKEN_EXPIRES_IN ??
    "7d") as SignOptions["expiresIn"];

  return jwt.sign(payload, secret, {
    expiresIn,
  });
}
