import { ReactNode } from "react";

// Tipado de usuario
export interface User {
  completion: ReactNode;
  username: string;
  email: string;
  rank?: string;
  gamesPlayed?: number;
  completionRate?: number;
  attempts?: number;
  victories?: number;

}

// Valores por defecto o constantes de prueba
export const DEFAULT_USER: User = {
  username: "Agent007",
  email: "agent@abyss.ai",
  rank: "Operative",
  gamesPlayed: 1,
  completionRate: 10,
  attempts: 3,
  victories: 0,
  completion: undefined
};
