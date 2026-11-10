export const SESSION_COOKIE_NAME = "parking_session";

export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  HOME: "/",
} as const;

export const PROTECTED_PATH_PREFIXES = ["/bookings", "/admin"] as const;

export const GUEST_ONLY_PATHS = [AUTH_ROUTES.LOGIN, AUTH_ROUTES.REGISTER] as const;

export const REDIRECT_PARAM = "redirectTo";
