import { OpenAPIHono } from "@hono/zod-openapi";
import { authRateLimiter } from "../../middleware/rateLimiter";
import signupRoutes from "./signup";
import loginRoutes from "./login";
import profileRoutes from "./profile";
import type { Env } from "../../types";

const app = new OpenAPIHono<Env>();

// Apply stricter rate limiting to auth endpoints
app.use("*", authRateLimiter());

// Mount auth sub-routes
app.route("/", signupRoutes);
app.route("/", loginRoutes);
app.route("/", profileRoutes);

export default app;
