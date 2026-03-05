import { OpenAPIHono } from "@hono/zod-openapi";
import { signupRoute, loginRoute, logoutRoute, meRoute } from "./auth.openapi";
import { lucia } from "../lib/auth";
import { db } from "../lib/db";
import { userTable } from "../db/schema";
import { hash, verify } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { authRateLimiter } from "../middleware/rate-limiter";
import type { Env } from "../types";

const app = new OpenAPIHono<Env>();

// Apply stricter rate limiting to auth endpoints
app.use("*", authRateLimiter());

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Signup
app.openapi(signupRoute, async (c) => {
  try {
    const { email, password, name } = c.req.valid("json");

    // Check if user exists
    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return c.json({ error: "User already exists" }, 400);
    }

    // Hash password
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    // Create user
    const userId = generateIdFromEntropySize(10);
    await db.insert(userTable).values({
      id: userId,
      email,
      passwordHash,
      name,
    });

    // Create session
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    c.header("Set-Cookie", sessionCookie.serialize());

    return c.json(
      {
        message: "User created successfully",
        user: { id: userId, email, name },
      },
      201,
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Validation failed", details: error.issues }, 400);
    }
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Login
// @ts-expect-error - OpenAPI strict typing with multiple response types
app.openapi(loginRoute, async (c) => {
  try {
    const { email, password } = c.req.valid("json");

    // Find user
    const users = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);

    if (users.length === 0) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const user = users[0];

    // Verify password
    const validPassword = await verify(user.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    // Create session
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    c.header("Set-Cookie", sessionCookie.serialize());

    return c.json({
      message: "Login successful",
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Validation failed", details: error.issues }, 400);
    }
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Logout
app.openapi(logoutRoute, async (c) => {
  const sessionId = c.req.header("Authorization")?.replace("Bearer ", "");

  if (sessionId) {
    await lucia.invalidateSession(sessionId);
  }

  const sessionCookie = lucia.createBlankSessionCookie();
  c.header("Set-Cookie", sessionCookie.serialize());

  return c.json({ message: "Logged out successfully" });
});

// Get current user
// @ts-expect-error - OpenAPI strict typing with multiple response types
app.openapi(meRoute, async (c) => {
  const user = c.get("user");

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  return c.json({ user });
});

export default app;
