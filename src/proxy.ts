import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  AUTH_ROUTES,
  GUEST_ONLY_PATHS,
  PROTECTED_PATH_PREFIXES,
  REDIRECT_PARAM,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/constants";

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  const isProtected = PROTECTED_PATH_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix));
  if (isProtected && !hasSession) {
    const loginUrl = new URL(AUTH_ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set(REDIRECT_PARAM, `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  const isGuestOnly = GUEST_ONLY_PATHS.some((path) => matchesPrefix(pathname, path));
  if (isGuestOnly && hasSession) {
    return NextResponse.redirect(new URL(AUTH_ROUTES.HOME, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
