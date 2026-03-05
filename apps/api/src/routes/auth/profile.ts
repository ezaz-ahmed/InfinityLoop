import { OpenAPIHono } from "@hono/zod-openapi";
import { logoutRoute, meRoute } from "./auth.openapi";
import { AuthService } from "../../services/auth.service";
import { logger } from "../../utils/logger";
import type { Env } from "../../types";

const app = new OpenAPIHono<Env>();

// Logout
app.openapi(logoutRoute, async (c) => {
  const requestId = c.get("requestId");
  const sessionId = c.req.header("Authorization")?.replace("Bearer ", "");

  logger.info("Logout attempt", requestId);

  const sessionCookie = await AuthService.logout(sessionId);
  c.header("Set-Cookie", sessionCookie.serialize());

  logger.info("Logout successful", requestId);

  return c.json({ message: "Logged out successfully" });
});

// Get current user
// @ts-expect-error - OpenAPI strict typing with multiple response types
app.openapi(meRoute, async (c) => {
  const requestId = c.get("requestId");
  const user = c.get("user");

  if (!user) {
    logger.warn("Unauthorized access attempt", requestId);
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userData = await AuthService.getCurrentUser(user.id);

  if (!userData) {
    logger.warn("User not found", requestId, { userId: user.id });
    return c.json({ error: "User not found" }, 404);
  }

  return c.json({ user: userData });
});

export default app;
