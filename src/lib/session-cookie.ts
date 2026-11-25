const isProduction = process.env.NODE_ENV === "production";

export const SESSION_COOKIE_NAME = isProduction ? "__Host-admin_session" : "admin_session";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: isProduction,
  path: "/",
  maxAge: 8 * 60 * 60,
};
