import { OpenAPIHono } from "@hono/zod-openapi";
import { loginRoute } from "./auth.openapi";
import { AuthService } from "../../services/auth.service";
import { z } from "zod";
import { logger } from "../../utils/logger";
import { env } from "../../utils/env";
import type { Env } from "../../types";

const app = new OpenAPIHono<Env>();

// @ts-expect-error - OpenAPI strict typing with multiple response types
app.openapi(loginRoute, async (c) => {
  const requestId = c.get("requestId");

  try {
    const { email, password } = c.req.valid("json");

    logger.info("Login attempt", requestId, { email });

    const { user, sessionCookie } = await AuthService.login({
      email,
      password,
    });

    c.header("Set-Cookie", sessionCookie.serialize());

    logger.info("Login successful", requestId, { userId: user.id });

    return c.json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Validation failed", details: error.issues }, 400);
    }

    if (error instanceof Error && error.message === "Invalid credentials") {
      logger.warn("Login failed - invalid credentials", requestId);
      return c.json({ error: error.message }, 401);
    }

    if (error instanceof Error) {
      logger.error("Login error", requestId, { error: error.message });
    }

    const message =
      env.APP_ENV === "production"
        ? "Internal server error"
        : error instanceof Error
          ? error.message
          : "Unknown error";

    return c.json({ error: message }, 500);
  }
});

export default app;
