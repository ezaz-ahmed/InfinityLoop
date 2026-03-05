import { OpenAPIHono } from "@hono/zod-openapi";
import { signupRoute } from "./auth.openapi";
import { AuthService } from "../../services/auth.service";
import { z } from "zod";
import { logger } from "../../utils/logger";
import { env } from "../../utils/env";
import type { Env } from "../../types";

const app = new OpenAPIHono<Env>();

app.openapi(signupRoute, async (c) => {
  const requestId = c.get("requestId");

  try {
    const { email, password, name } = c.req.valid("json");

    logger.info("Signup attempt", requestId, { email });

    const { user, sessionCookie } = await AuthService.signup({
      email,
      password,
      name,
    });

    c.header("Set-Cookie", sessionCookie.serialize());

    logger.info("Signup successful", requestId, { userId: user.id });

    return c.json(
      {
        message: "User created successfully",
        user,
      },
      201,
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Validation failed", details: error.issues }, 400);
    }

    if (error instanceof Error) {
      if (error.message === "User already exists") {
        logger.warn("Signup failed - user exists", requestId);
        return c.json({ error: error.message }, 400);
      }

      logger.error("Signup error", requestId, { error: error.message });
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
