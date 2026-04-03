"use client";

import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

/** Dades de l'usuari autenticat extretes del JWT */
type AuthUser = {
  id: number;
  email: string;
  username: string;
  role: string;
};

/** Payload del JWT tal com el retorna el backend */
type JwtPayload = AuthUser & { sub: number };

/** Valors exposats pel context d'autenticació */
type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** Desa el token, sincronitza la cookie i actualitza l'estat de l'usuari */
  login: (token: string) => void;
  /** Elimina el token, la cookie i buida l'estat de l'usuari */
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Decodifica un JWT i retorna les dades de l'usuari.
 * Retorna `null` si el token és invàlid.
 */
const decodeToken = (token: string): AuthUser | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return {
      id: decoded.sub,
      email: decoded.email,
      username: decoded.username,
      role: decoded.role,
    };
  } catch {
    return null;
  }
};

/**
 * Llegeix el token de localStorage i retorna l'usuari inicial.
 * S'usa com a inicialitzador lazy de useState per evitar efectes.
 */
const getInitialUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;

  const decoded = decodeToken(token);
  if (!decoded) localStorage.removeItem("token");
  return decoded;
};

/**
 * Proveïdor global d'autenticació.
 * Llegeix el token de localStorage en el muntatge inicial i exposa
 * les funcions login/logout a tots els components fills.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(getInitialUser);

  /**
   * Desa el token a localStorage i a una cookie per al middleware de Next.js,
   * i actualitza l'estat amb les dades decodificades del JWT.
   */
  const login = (token: string) => {
    localStorage.setItem("token", token);
    document.cookie = `auth-token=${token}; path=/`;
    const decoded = decodeToken(token);
    if (decoded) setUser(decoded);
  };

  /** Elimina el token de localStorage i la cookie, i buida l'usuari de l'estat. */
  const logout = () => {
    localStorage.removeItem("token");
    document.cookie = "auth-token=; path=/; max-age=0";
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook per accedir al context d'autenticació.
 * Llança un error si s'usa fora d'un `AuthProvider`.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth s'ha d'utilitzar dins d'un AuthProvider");
  return ctx;
};
