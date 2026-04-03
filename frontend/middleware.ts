import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  PROTECTED_ROUTES,
  ADMIN_ROUTES,
  AUTH_ROUTES,
} from "@/constants/navigation";
import { PATHS } from "@/constants/paths";

/**
 * Middleware de Next.js per a la protecció de rutes.
 *
 * - Rutes AUTH_ROUTES + token present → redirigeix a /
 * - Rutes PROTECTED_ROUTES + sense token → redirigeix a /login
 * - Rutes ADMIN_ROUTES + sense token o rol no admin → redirigeix a /login
 */
export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  if (AUTH_ROUTES.some((route) => pathname.startsWith(route)) && token) {
    return NextResponse.redirect(new URL(PATHS.HOME, request.url));
  }

  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL(PATHS.LOGIN, request.url));
  }

  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!token) return NextResponse.redirect(new URL(PATHS.LOGIN, request.url));
    try {
      // Decodifiquem el payload del JWT (sense verificar signatura — és responsabilitat del backend)
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL(PATHS.LOGIN, request.url));
      }
    } catch {
      return NextResponse.redirect(new URL(PATHS.LOGIN, request.url));
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};
