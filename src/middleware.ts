// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Si l'URL est /maloya974, on crée le cookie et redirige vers home
  if (path === "/maloya974") {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("maintenance-bypass", "true", {
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  }

  return NextResponse.next();
}

// Configurer sur quels chemins le middleware s'applique
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
