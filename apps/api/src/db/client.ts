import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "./schema";
import { env } from "../utils/env";

// Create pg pool with environment variable
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

// Create drizzle instance
export const db = drizzle(pool, { schema });

// Export pool for health checks or direct access
export const pgPool = pool;
