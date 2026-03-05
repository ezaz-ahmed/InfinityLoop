import type { Context, Next } from "hono";
import { lucia } from "../lib/auth";
import { getCookie } from "hono/cookie";

export async function authMiddleware(c: Context, next: Next) {
  // Try to get session from Authorization header first
  const authHeader = c.req.header("Authorization");
  let sessionId = lucia.readBearerToken(authHeader ?? "");

  // If no Authorization header, try to get session from cookie
  if (!sessionId) {
    sessionId = getCookie(c, lucia.sessionCookieName) ?? null;
  }

  if (!sessionId) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    c.header("Set-Cookie", sessionCookie.serialize());
  }

  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    c.header("Set-Cookie", sessionCookie.serialize());
  }

  c.set("user", user);
  c.set("session", session);

  return next();
}

export function requireAuth() {
  return async (c: Context, next: Next) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return next();
  };
}
