type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Error personalitzat per a respostes no-OK de l'API.
 * Inclou el codi d'estat HTTP per permetre tractament diferenciat
 * (ex: 401 per redirigir al login, 400 per mostrar missatge de validació).
 */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Client HTTP genèric per a totes les crides a l'API.
 * Gestiona la serialització JSON i el tractament d'errors.
 */
export const request = async <T>(
  url: string,
  method: HttpMethod = "GET",
  body?: unknown,
): Promise<T> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(data.message ?? "Error desconegut", res.status);
  }

  return data as T;
};
