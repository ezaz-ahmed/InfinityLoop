import { hash, verify } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { userTable } from "../db/schema";
import { lucia } from "../lib/auth";

const ARGON2_CONFIG = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export interface SignupInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
}

export class AuthService {
  static async signup(input: SignupInput) {
    const { email, password, name } = input;

    // Check if user exists
    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error("User already exists");
    }

    // Hash password
    const passwordHash = await hash(password, ARGON2_CONFIG);

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

    return {
      user: { id: userId, email, name },
      sessionCookie,
    };
  }

  static async login(input: LoginInput) {
    const { email, password } = input;

    // Find user
    const users = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);

    if (users.length === 0) {
      throw new Error("Invalid credentials");
    }

    const user = users[0];

    // Verify password
    const validPassword = await verify(
      user.passwordHash,
      password,
      ARGON2_CONFIG,
    );

    if (!validPassword) {
      throw new Error("Invalid credentials");
    }

    // Create session
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    return {
      user: { id: user.id, email: user.email, name: user.name },
      sessionCookie,
    };
  }

  static async logout(sessionId: string | undefined) {
    if (sessionId) {
      await lucia.invalidateSession(sessionId);
    }
    return lucia.createBlankSessionCookie();
  }

  static async getCurrentUser(userId: string): Promise<UserResponse | null> {
    const users = await db
      .select({
        id: userTable.id,
        email: userTable.email,
        name: userTable.name,
      })
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    return users[0] || null;
  }
}
