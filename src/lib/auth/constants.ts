export const SESSION_COOKIE_NAME = "parking_session";

export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  /** Where signed-in users land when they visit a guest-only page. */
  HOME: "/",
} as const;

/** Path prefixes that require a session. Browsing parking lots stays public. */
export const PROTECTED_PATH_PREFIXES = ["/bookings"] as const;

/** Pages only guests should see; signed-in users are sent home. */
export const GUEST_ONLY_PATHS = [AUTH_ROUTES.LOGIN, AUTH_ROUTES.REGISTER] as const;

export const REDIRECT_PARAM = "redirectTo";
