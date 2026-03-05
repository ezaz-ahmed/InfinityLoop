import { createRoute, z } from "@hono/zod-openapi";

// Shared schemas
const userSchema = z.object({
  id: z.string().openapi({ example: "abc123def456" }),
  email: z.string().email().openapi({ example: "user@example.com" }),
  name: z.string().openapi({ example: "John Doe" }),
});

const errorSchema = z.object({
  error: z.string(),
});

const validationErrorSchema = z.object({
  error: z.string().openapi({ example: "Validation failed" }),
  details: z.array(z.any()),
});

// Signup route
export const signupRoute = createRoute({
  method: "post",
  path: "/signup",
  tags: ["Authentication"],
  summary: "Register a new user",
  description: "Create a new user account with email and password",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            email: z.string().email().openapi({
              example: "user@example.com",
              description: "Valid email address",
            }),
            password: z.string().min(8).openapi({
              example: "securepassword123",
              description: "Password with minimum 8 characters",
            }),
            name: z.string().min(2).openapi({
              example: "John Doe",
              description: "User's display name (minimum 2 characters)",
            }),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "User created successfully",
      content: {
        "application/json": {
          schema: z.object({
            message: z
              .string()
              .openapi({ example: "User created successfully" }),
            user: userSchema,
          }),
        },
      },
      headers: z.object({
        "Set-Cookie": z.string().openapi({
          description: "Session cookie",
        }),
      }),
    },
    400: {
      description: "Bad request - validation error or user already exists",
      content: {
        "application/json": {
          schema: z.union([errorSchema, validationErrorSchema]),
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
  },
});

// Login route
export const loginRoute = createRoute({
  method: "post",
  path: "/login",
  tags: ["Authentication"],
  summary: "Login user",
  description: "Authenticate a user and create a session",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            email: z.string().email().openapi({
              example: "user@example.com",
              description: "Email address",
            }),
            password: z.string().openapi({
              example: "securepassword123",
              description: "Password",
            }),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Login successful",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string().openapi({ example: "Login successful" }),
            user: userSchema,
          }),
        },
      },
      headers: z.object({
        "Set-Cookie": z.string().openapi({
          description: "Session cookie",
        }),
      }),
    },
    401: {
      description: "Unauthorized - invalid credentials",
      content: {
        "application/json": {
          schema: errorSchema.openapi({
            example: { error: "Invalid credentials" },
          }),
        },
      },
    },
    400: {
      description: "Bad request - validation error",
      content: {
        "application/json": {
          schema: validationErrorSchema,
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
  },
});

// Logout route
export const logoutRoute = createRoute({
  method: "post",
  path: "/logout",
  tags: ["Authentication"],
  summary: "Logout user",
  description: "Invalidate the current session and log out the user",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Logged out successfully",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string().openapi({ example: "Logged out successfully" }),
          }),
        },
      },
      headers: z.object({
        "Set-Cookie": z.string().openapi({
          description: "Clears session cookie",
        }),
      }),
    },
  },
});

// Get current user route
export const meRoute = createRoute({
  method: "get",
  path: "/me",
  tags: ["Authentication"],
  summary: "Get current user",
  description: "Retrieve information about the currently authenticated user",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Current user information",
      content: {
        "application/json": {
          schema: z.object({
            user: userSchema,
          }),
        },
      },
    },
    401: {
      description: "Unauthorized - authentication required",
      content: {
        "application/json": {
          schema: errorSchema.openapi({ example: { error: "Unauthorized" } }),
        },
      },
    },
  },
});
